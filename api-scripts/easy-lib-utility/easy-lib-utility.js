/*
@language: en-US
@title: Easy Utility Library Module
@subject: Utility Functions for Roll20 Easy Modules
@tags: roll20, javascript, api, utility
@category: User Acceptance Testing
@content status: UAT
@company: Tougher Together Gaming (https://github.com/Tougher-Together-Gaming)
@author: Mhykiel
@comment: This module provides utility functions for Easy Modules in Roll20. It allows other modules to selectively 
		  retrieve and use utility functions, maintaining modularity and reusability.
@license: MIT License

MIT License

Copyright (c) 2024 Tougher Together Gaming (https://github.com/Tougher-Together-Gaming)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated 
documentation files (the "Software"), to deal in the Software without restriction, including without limitation 
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and 
to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions 
of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED 
TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF 
CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
DEALINGS IN THE SOFTWARE.
*/

// eslint-disable-next-line no-unused-vars
const EASY_LIB_UTILITY = (() => {

	/*******************************************************************************************************************
	* SECTION PRIVATE DATA                                                                                            *
	*******************************************************************************************************************/

	// Configuration and settings for the module
	const moduleSettings = {
		modName: "Easy-LibUtility",
		shortName: "easyutility",
		globalName: "EASY_LIB_UTILITY",
		version: "0.1.0",
		author: "Mhykiel2",
		verbose: true
	};

	// !SECTION END of Private Data

	/*******************************************************************************************************************
	* SECTION UTILITY FUNCTIONS                                                                                        *
	*******************************************************************************************************************/

	// ANCHOR Function Map for Status and Error Codes
	/**
	* Maps status codes to their corresponding log or error handler functions.
	*
	* Associates numeric status codes with specific handler functions for logging and error reporting.
	*
	* This map provides a standardized way to handle and report different statuses and errors. Each 
	* status code is mapped to a function that performs a specific action, such as logging messages 
	* or sending whispers. This approach ensures consistent feedback to users, simplifies debugging, 
	* and makes it easier to localize or translate logs for different environments.
	*
	* A centralized map for status codes ensures modular and maintainable error handling, 
	* standardizes responses, and reduces redundancy in logging logic.
	*
	* @constant {Object<string, Function>} statusHandlerMap
	* 
	* @example
	* const statusHandlers = _getStatusHandlerMap(utils);
	* statusHandlers["10000"]();
	* statusHandlers["70000"]("Testing DEBUG message.");
	*/
	function _createStatusCodeMappings({ thisUtilities }) {
		const codeToFunctionMap = {
			"0": () => { return thisUtilities.LogSyslogMessage({ severity: "INFO", code: "0", message: "Success" }); },
			"1": () => { return thisUtilities.LogSyslogMessage({ severity: "ERROR", code: "1", message: "Failure" }); },
			"10000": () => { return thisUtilities.LogSyslogMessage({ severity: "INFO", code: "10000", message: ".=> Initializing <=." }); },
			"10010": (remark) => { return thisUtilities.LogSyslogMessage({ severity: "INFO", code: "10010", message: `Synchronously Processing: ${remark}` }); },
			"10020": (remark) => { return thisUtilities.LogSyslogMessage({ severity: "INFO", code: "10020", message: `Asynchronously Processing: ${remark}` }); },
			"20000": () => { return thisUtilities.LogSyslogMessage({ severity: "INFO", code: "20000", message: ".=> Ready <=." }); },
			"20010": (remark) => { return thisUtilities.LogSyslogMessage({ severity: "INFO", code: "20010", message: `Completed: ${remark}` }); },
			"20020": (remark) => { return thisUtilities.LogSyslogMessage({ severity: "INFO", code: "20020", message: `Created: ${remark}` }); },
			"40000": (remark) => { return thisUtilities.LogSyslogMessage({ severity: "WARN", code: "40000", message: `Warning: ${remark}` }); },
			"50000": (remark) => { return thisUtilities.LogSyslogMessage({ severity: "ERROR", code: "50000", message: `Critical Failure: ${remark}` }); },
			"50010": (remark) => { return thisUtilities.LogSyslogMessage({ severity: "ERROR", code: "50010", message: `Not Found: ${remark}` }); },
			"50011": (remark) => { return thisUtilities.LogSyslogMessage({ severity: "ERROR", code: "50011", message: `Not Found: ${remark} is an unavailable function.` }); },
			"50012": (remark) => { return thisUtilities.LogSyslogMessage({ severity: "ERROR", code: "50012", message: `Not Found: The Player '${remark}' was not found.` }); },
			"50013": (remark) => { return thisUtilities.LogSyslogMessage({ severity: "ERROR", code: "50013", message: `Not Found: The Token '${remark}' was not found.` }); },
			"50014": (remark) => { return thisUtilities.LogSyslogMessage({ severity: "ERROR", code: "50014", message: `Not Found: The Character Sheet '${remark}' was not found.` }); },
			"50015": (remark) => { return thisUtilities.LogSyslogMessage({ severity: "ERROR", code: "50015", message: `Not Found: The Handout '${remark}' was not found.` }); },
			"50020": (remark) => { return thisUtilities.LogSyslogMessage({ severity: "ERROR", code: "50020", message: `Bad Arguments: ${remark}` }); },
			"50021": (remark) => { return thisUtilities.LogSyslogMessage({ severity: "ERROR", code: "50021", message: `Bad Arguments: The api command '${remark}' is invalid.` }); },
			"60000": (remark, playerId) => { return thisUtilities.WhisperPlayerMessage({ toId: playerId, message: `${remark}` }); },
			"60010": (remark, apiCall) => { return thisUtilities.WhisperErrorMessage({ apiCall: apiCall, errDescription: `${remark}` }); },
			"70000": (remark) => { return thisUtilities.LogSyslogMessage({ severity: "DEBUG", code: "70000", message: `${remark}` }); },
		};


		return {
			// Get the entire map or a specific handler by code
			get: ({ code } = {}) => {return (code ? codeToFunctionMap[code] : codeToFunctionMap);},

			// Set or replace the entire map
			set: ({ newMap }) => {
				Object.keys(codeToFunctionMap).forEach(key => {return delete codeToFunctionMap[key];}); // Clear existing entries
				Object.assign(codeToFunctionMap, newMap); // Add new entries
			},

			// Add new handlers or overwrite existing ones
			add: ({ newHandlers }) => {
				Object.assign(codeToFunctionMap, newHandlers);
			},

			// Remove a specific handler by code
			remove: ({ code } = {}) => {
				delete codeToFunctionMap[code];
			},
		};
	};

	function _createCssStyleMappings({ thisCssStyles }) {
		const themeToFunctionMap = {
			"chatError": () => { return thisCssStyles.({ }); },
		};

		return {
			// Get the entire map or a specific handler by code
			get: ({ theme } = {}) => {return (theme ? themeToFunctionMap[theme] : themeToFunctionMap);},

			// Set or replace the entire map
			set: ({ newMap }) => {
				Object.keys(themeToFunctionMap).forEach(key => {return delete themeToFunctionMap[key];}); // Clear existing entries
				Object.assign(themeToFunctionMap, newMap); // Add new entries
			},

			// Add new handlers or overwrite existing ones
			add: ({ newHandlers }) => {
				Object.assign(themeToFunctionMap, newHandlers);
			},

			// Remove a specific handler by code
			remove: ({ theme } = {}) => {
				delete themeToFunctionMap[theme];
			},
		};
	};

	// ANCHOR Utility Create System Log Message
	/**
	* Generates and sends a syslog-compatible log message to the API console.
	*
	* Creates a timestamped log message using severity, code, and message fields.
	*
	* This utility function formats log messages in a syslog-compatible format, including 
	* a UTC timestamp, module name, severity level, and a JSON-formatted payload. It ensures 
	* consistent log structure and supports common severity aliases, like "Information" 
	* (mapped to "INFO") and "Warning" (mapped to "WARN"). The `severity` is normalized to 
	* ensure compatibility with expected levels, and a default value is used if unrecognized.
	*
	* This improves readability and standardization of log messages, making them easier to parse,
	* debug, and integrate with log analysis tools. The use of destructured parameters ensures
	* clarity and scalability when additional fields are added.
	*
	* @param {Object} params - The parameters for the log message.
	* @param {string} params.severity - The severity level of the log (e.g., "INFO", "ERROR", "DEBUG").
	* @param {string} params.code - The application or script code generating the log.
	* @param {string} params.message - The log message to be included.
	* @param {string} [params.moduleName] - The name of the module generating the log (defaults to "SYSTEM").
	* @returns {string} The formatted syslog message.
	* 
	* @example
	* const logMessage = _logSyslogMessage({
	*   severity: "DEBUG",
	*   code: "70000",
	*   message: "The system is running smoothly.",
	*   moduleName: "Easy-Utility"
	* });
	* // Ex Output: 2024-12-03T10:30:45.123Z [Easy-Utility] (DEBUG) : {"code": 70000, "message": "The system is running smoothly."}"
	*/
	function _logSyslogMessage({ severity, code, message }) {

		// Helper function to generate the syslog-compatible timestamp
		const _getSyslogTimestamp = () => {
			const now = new Date();

			return now.toISOString();
		};

		const severityLevels = ["DEBUG", "INFO", "WARN", "ERROR"];
		const normalizedSeverity = severityLevels.includes(severity.toUpperCase())
			? severity.toUpperCase()
			: "INFO";

		const logMessage = `${_getSyslogTimestamp()} [${this.modName}] (${normalizedSeverity}): {"code": ${code}, "message": "${message}"}`;
		log(logMessage);

		return logMessage;
	};

	// ANCHOR Utility Whisper Player ID (or GM) a Message
	/**
	* Sends a whispered message to a specified player based on their player ID.
	* If the recipient is a GM, the message is sent using `/w gm`.
	* 
	* This function handles player lookups securely, ensuring a valid player ID 
	* is provided and properly handles cases where the player is not found 
	* (e.g., the message is from another API command). 
	*
	* @param {Object} params - The parameters for the whisper message.
	* @param {string} params.from - The sender's name or identifier for the message.
	* @param {string} params.toId - The recipient's Roll20 player ID.
	* @param {string} params.message - The message content to be whispered.
	*/
	function _whisperPlayerMessage({ from, toId, message }) {

		let recipient = "gm";

		if (toId.toLowerCase() !== "gm") {
			const player = toId ? getObj("player", toId) : null;

			// Safely retrieve the player's display name or use "gm" as a fallback
			const playerName = player ? player.get("_displayname") || "gm" : "gm";

			// Determine if the player is a GM and set recipient accordingly
			recipient = playerIsGM(toId) ? "gm" : playerName;
		}

		// Output the message, substituting the module name to "from" if not provided
		const sender = from || `[${this.modName}]`;
		sendChat(sender, `/w ${recipient} ${message}`);

		return `${sender};;${recipient};;${message}`;
	};

	// ANCHOR Utility Whisper Error to Chat Message Sender
	/**
	* Sends a styled error message in chat to the player who issued a command.
	* 
	* Formats and whispers an error message to the player who sent the command.
	*
	* This function constructs a visually styled error message that includes the
	* attempted command, an error description, and helpful troubleshooting context.
	* It then whispers this message to the player who initiated the command. If
	* the player ID is missing or invalid, the function logs the error to the console.
	*
	* Provides clear, styled feedback for players when command errors occur,
	* improving usability and debugging.
	*
	* @param {Object} params - The parameters for the error message.
	* @param {Object} params.apiCall - The Roll20 message object containing player and command details.
	* @param {string} params.errDescription - A description of the error encountered.
	*/
	function _whisperErrorMessage({ apiCall, errDescription }) {

		// Construct the styled error message.
		const styledMessage = "<div style=\"border:1px solid black; background-color:#ffdddd; padding:10px; border-radius:10px;\">" +
			"<h3 style=\"color:#cc0000; margin:0; font-size:1.2em;\">Error</h3>" +
			"<p style=\"margin:5px 0;\">You attempted to run the following command:</p>" +
			"<div style=\"margin:8px 0; padding:0 5px; background-color:#ffffff; border:1px solid #cccccc; border-radius:5px; font-family:monospace;\">" +
			`<p>${apiCall.content}<p>` +
			"</div>" +
			`<p style="margin:5px 0;">${errDescription}.</p>` +
			`<p style="margin:5px 0; font-size:0.9em; color:#555;">If you continue to experience issues, contact the script author (${this.author}) for assistance.</p>` +
			"</div>";

		// Use the _whisper function to send the message to the player.
		_whisperPlayerMessage({
			from: `${this.modName}`,
			toId: `${apiCall.playerid}`,
			message: styledMessage,
		});

		return `${this.modName};;${apiCall.playerid};;${errDescription}`;
	};

	// ANCHOR Utility Encode Roll20 Note Content
	/**
	* Converts plain text into HTML-encoded text for safe use in Roll20 Handout's Notes, GM Notes, and Character Bio.
	*
	* Encodes special characters and whitespace into their HTML equivalents.
	*
	* This function ensures that plain text can be safely stored or displayed in HTML contexts
	* by converting special characters, spaces, and newlines into their respective HTML entities.
	* It helps prevent formatting loss and potential issues with special characters.
	*
	* Provides a consistent method to encode text for Roll20 Notes, ensuring compatibility with HTML formatting.
	*
	* @param {Object} params - The parameters for encoding.
	* @param {string} params.plainText - The input string containing plain text.
	* @returns {string} The HTML-encoded string for safe use in Roll20 Notes.
	*
	* @example
	* const encodedText = _encodeNoteContent({ plainText: "Hello <World> & 'Friends'" });
	* // Output: "Hello&nbsp;&lt;World&gt;&nbsp;&amp;&nbsp;&#39;Friends&#39;"
	*/
	function _encodeNoteContent({ plainText }) {
		return plainText
			.replace(/&/g, "&amp;")   // Encode & (must be done first to avoid double replacements)
			.replace(/</g, "&lt;")    // Encode <
			.replace(/>/g, "&gt;")    // Encode >
			.replace(/"/g, "&quot;")  // Encode "
			.replace(/'/g, "&#39;")   // Encode '
			.replace(/ /g, "&nbsp;")  // Encode spaces as non-breaking
			.replace(/\n/g, "<br>");  // Encode newlines as <br>
	};

	// ANCHOR Utility Decode Roll20 Note Content
	/**
	* Converts HTML-encoded text into plain readable text for use in Roll20 Notes.
	*
	* Decodes HTML entities back into their plain text equivalents.
	*
	* This function is designed to reverse the encoding process by converting HTML entities 
	* (such as `&lt;`, `&gt;`, etc.) back into their original characters, spaces, and line breaks. 
	* Useful for programmatically manipulating Roll20 Note content.
	*
	* Simplifies handling encoded text by providing plain, readable text for processing or updates.
	*
	* @param {Object} params - The parameters for decoding.
	* @param {string} params.encodedText - The input string containing HTML-encoded characters.
	* @returns {string} The plain text with HTML entities decoded into readable characters.
	*
	* @example
	* const decodedText = _decodeNoteContent({ encodedText: "Hello&nbsp;&lt;World&gt;&nbsp;&amp;&nbsp;&#39;Friends&#39;" });
	* // Output: "Hello <World> & 'Friends'"
	*/
	function _decodeNoteContent({ encodedText }) {
		return encodedText
			.replace(/&lt;/g, "<")    // Decode <
			.replace(/&gt;/g, ">")    // Decode >
			.replace(/&quot;/g, "\"") // Decode "
			.replace(/&#39;/g, "'")   // Decode '
			.replace(/&nbsp;/g, " ")  // Decode non-breaking spaces
			.replace(/<br>/g, "\n")   // Decode line breaks
			.replace(/&amp;/g, "&");  // Decode & (must be done last to avoid double replacements)
	};

	// ANCHOR Utility Parse Chat Commands
	/**
	* Extracts commands and their arguments from a chat message.
	* 
	* Parses a message string to identify commands (prefixed with `--`) and their associated arguments.
	*
	* This function splits a chat message into commands and arguments using `--` as a delimiter.
	* Each command is stored as a key in a `Map`, with its associated arguments stored as an array.
	* The resulting `Map` provides an efficient and clean way to process chat commands dynamically.
	*
	* Using a `Map` ensures commands are unique and allows efficient lookup and processing of commands
	* and their arguments. It also simplifies handling multiple commands in a single message.
	*
	* @param {Object} params - The parameters for parsing chat commands.
	* @param {string} params.apiCallContent - The full chat message containing commands and arguments.
	* @returns {Map<string, string[]>} A map where each key is a command (e.g., `--menu`), 
	* and the value is an array of arguments for that command.
	*
	* @example
	* const commands = _parseChatCommands({ apiCallContent: "--menu option1 option2 --help" });
	* log(commands);
	* // Output:
	* // Map {
	* //   "--menu" => ["option1", "option2"],
	* //   "--help" => []
	* // }
	*/
	function _parseChatCommands({ apiCallContent }) {

		const commandMap = new Map();

		// Step 1: Split the message into segments using '--' as a delimiter.
		const segments = apiCallContent.split("--").filter(segment => { return segment.trim() !== ""; });

		// Step 2: Process each segment (after the first, which is the API call).
		segments.forEach(segment => {
			const [command, ...args] = segment.trim().split(/\s+/);

			// Store command with '--' prefix (to maintain consistency) and its arguments
			commandMap.set(`--${command}`, args);
		});

		return commandMap;
	};

	// ANCHOR Utility Parse Command Arguments (subcommands)
	/**
	* Parses command arguments into key-value pairs or returns them as standalone flags.
	* 
	* Processes an array of command arguments, identifying key-value pairs or treating 
	* standalone arguments as boolean flags.
	*
	* This function iterates over an array of arguments, splitting key-value pairs using
	* `|` or `#` as delimiters. If no delimiter is found, the argument is treated as a 
	* standalone flag (e.g., `arg => true`). The result is an object mapping argument keys 
	* to their values or `true` for standalone flags.
	*
	* Encapsulating subcommands in a structured object simplifies access and ensures consistent
	* handling of complex command structures.
	*
	* @param {Object} params - The parameters for parsing command arguments.
	* @param {string[]} params.subcommands - The array of arguments from a parsed command.
	* @returns {Object<string, string|boolean>} An object where keys are argument identifiers 
	* and values are either the corresponding argument values or `true` for standalone flags.
	*
	* @example
	* const parsedArgs = _parseSubcommandArgs({ subcommands: ["key1|value1", "key2#value2", "flag"] });
	* console.log(parsedArgs);
	* // Output: { key1: "value1", key2: "value2", flag: true }
	*/
	function _parseSubcommandArgs({ subcommands }) {

		const subcommandMap = {};

		// Process each argument in the array.
		subcommands.forEach(arg => {

			// Check for key-value pair using | or # as the delimiter.
			const delimiterMatch = arg.includes("|") ? "|" : arg.includes("#") ? "#" : null;

			if (delimiterMatch) {
				const [key, value] = arg.split(delimiterMatch);

				// Add to the subcommands object.
				subcommandMap[key] = value;
			} else {

				// If no delimiter is found, treat the argument as a standalone flag (e.g., boolean).
				subcommandMap[arg] = true;
			}
		});

		return subcommandMap;
	};

	/**
	* Creates a curried function with named arguments for both preset and later arguments.
	* 
	* Combines preset and later arguments into a single object for a target function.
	*
	* This function allows you to partially apply arguments to a target function that uses
	  * destructured parameters. It merges `presetArgs` with `laterArgs`, giving precedence to 
	* `laterArgs` in case of overlapping keys. This approach is particularly useful for 
	* working with functions that take configuration objects as arguments.
	*
	* Encapsulates and simplifies the partial application of arguments for functions
	* that work with named parameters, improving readability and modularity.
	*
	* @param {Object} params - The parameters for creating a curried function.
	* @param {Function} params.func - The target function to partially apply arguments to.
	* @param {Object} [params.presetArgs={}] - The initial arguments to pre-fill in the function.
	* @returns {Function} A new function that takes the remaining arguments and applies them.
	*
	* @example
	* const add = ({ a, b, c }) => a + b + c;
	* const curriedAdd = _newCurryFunc({ func: add, presetArgs: { a: 1, b: 2 } });
	* console.log(curriedAdd({ c: 3 })); // Outputs: 6
	*/
	function _newCurryFunc({ func, presetArgs = {} }) {
		return (laterArgs = {}) => { return func({ ...presetArgs, ...laterArgs }); };
	};

	// ANCHOR Utility Extract Data From Content
	/**
	* Extracts all matches of JSON content embedded within specific `<div>` elements from the provided content.
	* 
	* Searches the content for multiple matches of JSON data within targeted `<div>` elements.
	*
	* This function searches the provided string content using a given regular expression and 
	* returns an array of all matches. Each match corresponds to the JSON content extracted from 
	* the `<div>` elements. If no matches are found, an empty array is returned.
	*
	* Designed to handle multiple matches efficiently and return all extracted content for scenarios 
	* requiring data aggregation.
	*
	* @param {Object} params - The parameters for extracting data.
	* @param {string} params.content - The decoded content string (e.g., GM notes) to search for matches.
	* @param {string} params.regexString - The regular expression string used to locate content in `<div>` elements.
	* @returns {string[]} An array of strings containing all matched content.
	*
	* @example
	* const gmNotes = `
	*   <div id="data-container">{"key":"value1"}</div>
	*   <div id="data-container">{"key":"value2"}</div>
	* `;
	* const dataRegex = "<div id=\"data-container\">(.*?)</div>";
	* const extractedData = _parseDataFromContent({ content: gmNotes, regexString: dataRegex });
	* log(extractedData);
	* // Output: ['{"key":"value1"}', '{"key":"value2"}']
	*/
	function _parseDataFromContent({ content, regexString }) {

		const regex = new RegExp(`${regexString}`, "gs");
		const matchesArray = [...content.matchAll(regex)];
		
		// Extract and return the matched content
		return matchesArray.map(match => { return match[1] || ""; }).filter(Boolean);

	};

	// !SECTION End of Utility Functions

	/*******************************************************************************************************************
	 * SECTION PRIVATE FUNCTIONS                                                                                       *
	*******************************************************************************************************************/

	// ANCHOR Check Install
	const checkInstall = () => {

		// Alert Script is Initializing
		_logSyslogMessage.call(moduleSettings, {
			severity: "INFO",
			code: "10000",
			message: ".=> Initializing <=."
		});

		// NOTE Possibly more checks to perform in the future...

		return 0;
	};

	// ANCHOR Register Handlers
	const registerEventHandlers = () => {

		// NOTE Possibly more events to watch for in the future...

		// Script is ready
		_logSyslogMessage.call(moduleSettings, {
			severity: "INFO",
			code: "20000",
			message: ".=> Ready <=."
		});

		return 0;
	};

	// !SECTION End of Private Functions

	/*******************************************************************************************************************
	 * SECTION PUBLIC INTERFACE                                                                                        *
	*******************************************************************************************************************/

	// ANCHOR ...INITIALIZATION...
	on("ready", () => {

		const continueMod = checkInstall();

		// If installation successful continue
		if (continueMod === 0) {
			registerEventHandlers();
		}
	});

	// ANCHOR Registry for available utility functions
	// FIXME For now hand writing functions in this mapping. Had issues automating because the object was not inialized
	// and could not be inspected for each function starting with "_". 
	const availableUtilities = {
		CreateCssStyleMappings: _createCssStyleMappings,
		CreateStatusCodeMappings: _createStatusCodeMappings,
		DecodeNoteContent: _decodeNoteContent,
		EncodeNoteContent: _encodeNoteContent,
		LogSyslogMessage: _logSyslogMessage,
		NewCurryFunc: _newCurryFunc,
		ParseChatCommands: _parseChatCommands,
		ParseSubcommandArgs: _parseSubcommandArgs,
		ParseDataFromContent: _parseDataFromContent,
		WhisperErrorMessage: _whisperErrorMessage,
		WhisperPlayerMessage: _whisperPlayerMessage
	};

	return {
		// ANCHOR Utility Fetch Selected Utilities
		/**
		 * Selectively retrieves utility functions by other modules for use.
		 * 
		 * This function allows external modules to request only the utility functions they need, 
		 * promoting modularity and reducing unnecessary overhead. By passing a list of function names, 
		 * the requested utilities are returned as an object for easy integration.
		 * 
		 * Using selective retrieval ensures that modules only access the functionality they require, 
		 * improving code organization and performance by avoiding unnecessary imports.
		 * 
		 * @param {Object} options - Options for fetching utilities.
		 * @param {string[]} options.requestedFunctionsArray - A list of utility function names to retrieve.
		 * @param {Object} [options.thisModuleSettings={}] - An object to override the default module settings.
		 * @returns {Object<string, Function>} An object containing the requested utilities as key-function pairs.
		 * @throws {Error} If a requested utility function is not found in the registry.
		 * 
		 * @example
		 * // Retrieve and use specific utility functions
		 * const utils = FetchUtilities({
		 *   requestedFunctionsArray: ["LogSyslogMessage", "ParseChatCommands"],
		 *   thisModuleSettings: { globalName: "CustomEnv" },
		 * });
		 * utils.LogSyslogMessage({ severity: "INFO", code: "10001", message: "System initialized." });
		 * const commands = utils.ParseChatCommands({ apiCallContent: "!easyutility --log INFO Initialization complete" });
		 * console.log(commands);
		 */
		FetchUtilities: ({ requestedFunctionsArray = [], thisModuleSettings = {} } = {}) => {
			const selectedUtilities = {};
			const effectiveModuleSettings = { ...moduleSettings, ...thisModuleSettings };
	
			requestedFunctionsArray.forEach((aRequestedFunc) => {
				if (availableUtilities[aRequestedFunc]) {
					// Wrap each utility function to inject `moduleSettings` dynamically
					selectedUtilities[aRequestedFunc] = (...args) => {
						return availableUtilities[aRequestedFunc].call(effectiveModuleSettings, ...args);
					};
				} else {
					// Log a warning if the requested utility is not found
					_logSyslogMessage.call(moduleSettings, {
						severity: "WARN",
						code: "50010",
						message: `Not Found: '${moduleSettings.globalName}.${aRequestedFunc}()' is unavailable.`,
					});
				}
			});
	
			return selectedUtilities;
		},
	};

	// !SECTION END of Public Interface
})();
