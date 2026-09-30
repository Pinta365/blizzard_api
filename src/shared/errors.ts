/**
 * Custom error class representing an API error.
 * @class
 * @extends {Error}
 */
export class APIError extends Error {
    statusCode: number;
    responseBody: string;

    constructor(message: string, statusCode: number, responseBody: string) {
        super(message);
        this.name = "APIError";
        this.statusCode = statusCode;
        this.responseBody = responseBody;
    }
}

/**
 * Custom error class representing an Authentication error.
 * @class
 * @extends {Error}
 */
export class AuthenticationError extends Error {
    statusCode: number;
    responseBody: string;

    constructor(message: string, statusCode: number, responseBody: string) {
        super(message);
        this.name = "AuthenticationError";
        this.statusCode = statusCode;
        this.responseBody = responseBody;
    }
}

/**
 * Custom error class representing a missing client id error.
 * @class
 * @extends {Error}
 */
export class MissingClientIdError extends Error {
    constructor() {
        super("Client Id must be setup. Check documentation");
        this.name = "MissingClientIdError";
    }
}

/**
 * Custom error class representing a missing client secret error.
 * @class
 * @extends {Error}
 */
export class MissingClientSecretError extends Error {
    constructor() {
        super("Client Secret must be setup. Check documentation");
        this.name = "MissingClientSecretError";
    }
}

/**
 * Custom error class representing a missing api region error.
 * @class
 * @extends {Error}
 */
export class MissingRegionError extends Error {
    constructor() {
        super("Api region must be setup. Check documentation");
        this.name = "MissingRegionError";
    }
}

/**
 * Custom error class representing a missing user access token, needed for user-scoped endpoints
 * such as the WoW account profile. Obtain one with the authorization code flow and use client.forUser(token).
 * @class
 * @extends {Error}
 */
export class MissingUserTokenError extends Error {
    constructor() {
        super("This endpoint requires a user access token. Use client.forUser(token). Check documentation");
        this.name = "MissingUserTokenError";
    }
}
