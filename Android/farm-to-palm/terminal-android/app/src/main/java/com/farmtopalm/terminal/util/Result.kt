package com.farmtopalm.terminal.util

sealed class Result<out T> {
    data class Success<T>(val value: T) : Result<T>()
    data class Error(val message: String, val cause: Throwable? = null) : Result<Nothing>()
}

inline fun <T> Result<T>.onSuccess(block: (T) -> Unit): Result<T> {
    if (this is Result.Success) block(value)
    return this
}

inline fun <T> Result<T>.onError(block: (String, Throwable?) -> Unit): Result<T> {
    if (this is Result.Error) block(message, cause)
    return this
}

fun <T> Result<T>.getOrNull(): T? = (this as? Result.Success)?.value
