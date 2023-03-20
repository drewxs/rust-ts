import type {Config} from "jest";

const config: Config = {
    verbose: true,
    preset: "ts-jest",
    testEnvironment: "node",
    transform: {
        "^.+\\.ts$": "ts-jest",
    },
    testRegex: "(.*\\.(test|spec))\\.ts$",
};

export default config;
