package com.farmtopalm.terminal.data.crypto

import android.content.Context
import android.content.SharedPreferences
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import androidx.security.crypto.EncryptedSharedPreferences
import androidx.security.crypto.MasterKey
import com.farmtopalm.terminal.util.Logger
import java.security.KeyStore
import java.security.ProviderException
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

/** Sentinel prefix for token stored without Keystore (fallback when Keystore fails on device). */
private val PLAIN_SENTINEL = byteArrayOf(0x00, 0x01)

object Crypto {
    private const val ANDROID_KEYSTORE = "AndroidKeyStore"
    private const val KEY_ALIAS = "farmtopalm_biometric_enc"
    private const val GCM_TAG_LENGTH = 128
    private const val GCM_IV_LENGTH = 12

    // EncryptedSharedPreferences (Tink + MasterKey)
    private const val PREFS_NAME = "farmtopalm_secure"
    private const val FALLBACK_PREFS_NAME = "farmtopalm_secure_plain"
    private const val MASTER_KEY_ALIAS = "farm_to_palm_master_key"

    /**
     * Returns a SharedPreferences instance that WILL NOT crash the app.
     *
     * 1) Try EncryptedSharedPreferences (best)
     * 2) If it fails, delete the key + retry once
     * 3) If it still fails, fall back to standard SharedPreferences
     */
    fun prefs(context: Context): SharedPreferences {
        return tryCreateEncryptedPrefs(context)
            ?: run {
                Logger.d("Crypto: Using fallback SharedPreferences (Keystore unavailable on this device)")
                context.getSharedPreferences(FALLBACK_PREFS_NAME, Context.MODE_PRIVATE)
            }
    }

    private fun tryCreateEncryptedPrefs(context: Context): SharedPreferences? {
        val first = runCatching { createEncryptedPrefs(context) }.getOrNull()
        if (first != null) return first

        Logger.d("Crypto: EncryptedSharedPreferences failed; retrying after clearing keystore entry...")
        runCatching { deleteMasterKeyEntry() }

        return runCatching { createEncryptedPrefs(context) }
            .onFailure { e -> Logger.w("Crypto: Retry failed: ${e.message}; using fallback prefs") }
            .getOrNull()
    }

    private fun createEncryptedPrefs(context: Context): SharedPreferences {
        val masterKey = MasterKey.Builder(context, MASTER_KEY_ALIAS)
            .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
            .build()

        return EncryptedSharedPreferences.create(
            context,
            PREFS_NAME,
            masterKey,
            EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
            EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
        )
    }

    /**
     * Delete master key entry so Android can regenerate it.
     * Prevents "stuck" keystore state from crashing forever.
     */
    private fun deleteMasterKeyEntry() {
        try {
            val ks = java.security.KeyStore.getInstance("AndroidKeyStore")
            ks.load(null)
            if (ks.containsAlias(MASTER_KEY_ALIAS)) {
                ks.deleteEntry(MASTER_KEY_ALIAS)
                Logger.w("Crypto: Deleted keystore alias $MASTER_KEY_ALIAS")
            }
        } catch (e: Exception) {
            Logger.e("Crypto: Failed to delete keystore alias", e)
        }
    }

    fun getOrCreateAesKey(context: Context): SecretKey {
        val keyStore = KeyStore.getInstance(ANDROID_KEYSTORE).apply { load(null) }
        if (keyStore.containsAlias(KEY_ALIAS)) {
            @Suppress("UNCHECKED_CAST")
            return (keyStore.getEntry(KEY_ALIAS, null) as KeyStore.SecretKeyEntry).secretKey
        }
        val keyGenerator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, ANDROID_KEYSTORE)
        keyGenerator.init(
            KeyGenParameterSpec.Builder(KEY_ALIAS, KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT)
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setKeySize(256)
                .build()
        )
        return keyGenerator.generateKey()
    }

    /** True if the exception is due to Keystore/key generation failure (e.g. -1000 on some devices). */
    private fun isKeyStoreRelated(e: Exception): Boolean {
        if (e is ProviderException) return true
        val name = e.javaClass.name
        val causeName = e.cause?.javaClass?.name ?: ""
        val msg = e.message?.lowercase() ?: ""
        val causeMsg = e.cause?.message?.lowercase() ?: ""
        return name.contains("KeyStore", ignoreCase = true) ||
            name.contains("KeyGen", ignoreCase = true) ||
            causeName.contains("keystore", ignoreCase = true) ||
            msg.contains("keystore", ignoreCase = true) ||
            msg.contains("key generation") ||
            msg.contains("generatekeyinternal") ||
            msg.contains("-1000") ||
            msg.contains("failed on response") ||
            causeMsg.contains("keystore", ignoreCase = true) ||
            causeMsg.contains("-1000")
    }

    fun encrypt(context: Context, plain: ByteArray): ByteArray {
        return try {
            val key = getOrCreateAesKey(context)
            val cipher = Cipher.getInstance("AES/GCM/NoPadding")
            cipher.init(Cipher.ENCRYPT_MODE, key)
            val iv = cipher.iv
            val encrypted = cipher.doFinal(plain)
            iv + encrypted
        } catch (e: Exception) {
            if (isKeyStoreRelated(e)) {
                Logger.d("Crypto: Keystore unavailable, storing template with plain fallback")
                PLAIN_SENTINEL + plain
            } else {
                throw e
            }
        }
    }

    fun decrypt(context: Context, encrypted: ByteArray): ByteArray {
        if (encrypted.size < 2) throw IllegalArgumentException("Invalid ciphertext")
        if (encrypted[0] == PLAIN_SENTINEL[0] && encrypted[1] == PLAIN_SENTINEL[1]) {
            return encrypted.copyOfRange(2, encrypted.size)
        }
        if (encrypted.size < GCM_IV_LENGTH) throw IllegalArgumentException("Invalid ciphertext")
        val key = getOrCreateAesKey(context)
        val iv = encrypted.copyOfRange(0, GCM_IV_LENGTH)
        val cipherText = encrypted.copyOfRange(GCM_IV_LENGTH, encrypted.size)
        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        cipher.init(Cipher.DECRYPT_MODE, key, GCMParameterSpec(GCM_TAG_LENGTH, iv))
        return cipher.doFinal(cipherText)
    }
}
