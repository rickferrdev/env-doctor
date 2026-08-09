import fs from "node:fs/promises";
import path from "node:path";

export type ConfigHooksOptions = {
	afterLoadFile?: (filename: string) => void;
	beforeLoadFile?: (content: string) => void;
};

export type ConfigCustomizeOptions = {
	setSeparatorSymbol?: string;
	setCommentSymbol?: string;
	setRegexOfValue?: RegExp;
};

export type ConfigOptions = {
	path?: string[];
	customize?: ConfigCustomizeOptions;
	hooks?: ConfigHooksOptions;
};

async function config(options?: ConfigOptions) {
	const paths: string[] = (options?.path ?? [".env"]).map((file) =>
		path.join(process.cwd(), file),
	);

	for (const filename of paths) {
		let file: string = "";

		try {
			options?.hooks?.beforeLoadFile?.(filename);
			file = await fs.readFile(filename, { encoding: "utf-8", flag: "r" });
			options?.hooks?.afterLoadFile?.(file);

			if (!file) continue;
		} catch (error) {
			console.error(
				`[ENV-DOCTOR] a read exception occurred because the file ${filename} does not exist: ${error instanceof Error ? error.message : "unknown error"}`,
			);
		}

		file = file
			.trim()
			.split("\n")
			.map((line) => line.replace(/^\s*export\s+/, ""))
			.join("\n");

		for (let line of file.split("\n")) {
			line = line.trim();

			if (!line || line.startsWith(options?.customize?.setCommentSymbol ?? "#"))
				continue;

			const separator = line.indexOf(
				options?.customize?.setSeparatorSymbol ?? "=",
			);
			if (separator === -1) continue;

			const key = line.slice(0, separator);
			const value = line
				.slice(separator + 1)
				.replace(options?.customize?.setRegexOfValue ?? /\s+#.*$/, "")
				.trim();

			process.env[key] = value;
		}
	}
}

export { config };
export default config;
