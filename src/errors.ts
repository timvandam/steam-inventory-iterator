export default function getErrorForStatusCode(statusCode: number, message?: string): Error {
	if (statusCode >= 400 && statusCode < 500) {
		if (statusCode === 403) return new PrivateInventoryError()
		if (statusCode === 429) return new RateLimitError()
		return new ClientError(statusCode, message)
	}
	if (statusCode >= 500 && statusCode < 600) return new SteamError(statusCode, message)
	return new SteamInventoryIteratorError(statusCode, message)
}

export class SteamInventoryIteratorError extends Error {
	constructor(public statusCode: number, message?: string) {
		super(message)
	}
}

/**
 * Error that should completely stop iteration.
 */
export class FatalError extends SteamInventoryIteratorError {}

/**
 * Error caused by a 4xx response.
 */
export class ClientError extends SteamInventoryIteratorError {}

/**
 * Private inventory. This error will cause iteration to be stopped.
 * Caused by a 403 response.
 */
export class PrivateInventoryError extends FatalError {
	constructor() {
		super(403, "This user's inventory is private")
	}
}

/**
 * Rate limit. This will stop making requests for 5 seconds and try again.
 * Caused by a 429 response.
 */
export class RateLimitError extends ClientError {
	public static timeout = 5000

	constructor() {
		super(429, `You have been rate limited. Retrying in ${RateLimitError.timeout / 1000} seconds`)
	}
}

/**
 * Error caused by steam. Any 5xx response.
 */
export class SteamError extends SteamInventoryIteratorError {}
