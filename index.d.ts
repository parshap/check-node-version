/**
 * Which versions of which packages are required.
 */
interface Wanted {
    /**
     * Required version of Node.js.
     */
    node?: string;

    /**
     * Required version of npm.
     */
    npm?: string;

    /**
     * Required version of yarn.
     */
    yarn?: string;
}

type OnGetVersion = (error: Error | null, info: VersionInfo) => void;

/**
 * Gets the version of a package.
 *
 * @param packageName   Name of the package.
 * @param onComplete   Handler for the package name.
 */
type GetVersion = (packageName: string, onComplete: OnGetVersion) => void;

/**
 * Extra options to run with.
 */
interface Options {
    /**
     * @returns The version of a package.
     */
    getVersion: GetVersion;
}

/**
 * Positive result of checking a program version.
 */
interface SatisfiedVersionInfo {
    /**
     * Whether the version was known to satisfy its requirements (true).
     */
    isSatisfied: true;

    /**
     * Retrieved version.
     */
    version: string;
}

/**
 * Negative result of checking a program version.
 */
interface UnsatisfiedVersionInfo {
    /**
     * Whether the program version was unable to be found.
     */
    notfound?: boolean;

    /**
     * Any error thrown during checking.
     */
    error?: Error;

    /**
     * Whether the version was known to satisfy its requirements (false).
     */
    isSatisfied: false;

    /**
     * Retrieved version, if available.
     */
    version?: string;
}

/**
 * Result of checking a program version.
 */
type VersionInfo = SatisfiedVersionInfo | UnsatisfiedVersionInfo;

/**
 * Results from checking versions.
 */
interface Results {
    /**
     * Versions for each package.
     */
    versions: VersionInfo[];

    /**
     * Whether all versions were satisfied.
     */
    isSatisfied: boolean;
}

/**
 * Handles results from checking versions.
 *
 * @param error   Error from version checking, if any.
 * @param results   Results from checking versions.
 */
type OnComplete = (error: Error | null, results: Results) => void;

/**
 * Checks package versions.
 *
 * @param wanted   Which versions of programs are required.
 * @param onComplete   Handles results from checking versions.
 */
declare function check(wanted: Wanted, onComplete: OnComplete): void;
declare function check(wanted: Wanted, options: Options, onComplete: OnComplete): void;

export = check;
