/******************************************************************************\
# JS - JS                                        #       Maximum Tension       #
################################################################################
#                                                #      -__            __-     #
# Teoman Deniz                                   #  :    :!1!-_    _-!1!:    : #
# maximum-tension.com                            #  ::                      :: #
#                                                #  :!:    : :: : :  :  ::::!: #
# +.....................++.....................+ #   :!:: :!:!1:!:!::1:::!!!:  #
# : C - Maximum Tension :: Create - 2013/11/04 : #   ::!::!!1001010!:!11!!::   #
# :---------------------::---------------------: #   :!1!!11000000000011!!:    #
# : License - MIT       :: Update - 2026/06/25 : #    ::::!!!1!!1!!!1!!!::     #
# +.....................++.....................+ #       ::::!::!:::!::::      #
\******************************************************************************/

"use strict";

/**
 * ```js
 *       [boolean] IS_NULL([*] VALUE);
 *       [boolean] IS_EMPTY([*] VALUE);
 *       [boolean] IS_ARRAY([*] VALUE);
 *       [boolean] IS_OBJECT([*] VALUE);
 *        [object] CLONE([object] SOURCE);
 *        [object] MERGE([object] TARGET, [object] SOURCE);
 *          [void] ITERATE([object|array] OBJECT, [function] FUNCTION);
 * [Promise<void>] ASYNC_ITERATE([object|array] OBJECT, [function] FUNCTION);
 *        [string] TEMPLATE([string] TEMPLATE_STRING, [object] DATA);
 * ```
 */
const	JS =
{
	/**
	 * ```js
	 * [boolean] JS.IS_NULL([*] VALUE);
	 * ```
	 * CHECKS IF VARIABLE IS UNDEFINED OR NULL
	 *
	 * **VALUE** - SEND ANY VARIABLE TYPE
	 *
	 * ----
	 *
	 * **return** - `true` IF VALUE/VARIABLE IS NULL OR UNDEFINED.
	 */
	IS_NULL: function(VALUE)
	{
		return (typeof(VALUE) === "undefined" || VALUE === null);
	},

	/**
	 * ```js
	 * [boolean] JS.IS_EMPTY([*] VALUE);
	 * ```
	 * CHECKS IF VARIABLE IS UNDEFINED, NULL, OR EMPTY
	 *
	 * **VALUE** - SEND ANY VARIABLE TYPE
	 *
	 * ----
	 *
	 * **return** - `true` IF VALUE/VARIABLE IS EMPTY.
	 */
	IS_EMPTY: function(VALUE)
	{
		if (typeof(VALUE) === "undefined" || VALUE === null)
			return (true);

		if (typeof(VALUE) === "number")
			return (VALUE === 0);

		if (typeof(VALUE) === "string")
			return (VALUE === "");

		if (Array.isArray(VALUE))
			return (VALUE.length === 0);

		if (typeof(VALUE) === "object")
		{
			if (VALUE instanceof Node)
				return (!document.contains(VALUE));

			try
			{
				return (Object.keys(VALUE).length === 0);
			}
			catch (ERROR)
			{
				return (false);
			}
		}

		return (false);
	},

	/**
	 * ```js
	 * [boolean] JS.IS_ARRAY([*] VALUE);
	 * ```
	 * CHECKS IF VARIABLE IS AN ARRAY
	 *
	 * **VALUE** - SEND ANY VARIABLE TYPE
	 *
	 * ----
	 *
	 * **return** - `true` IF VALUE/VARIABLE IS AN ARRAY.
	 */
	IS_ARRAY: function(VALUE)
	{
		if (typeof(Array) === "object" && typeof(Array.isArray) === "function")
			return (Array.isArray(VALUE));

		return (Object.prototype.toString.call(VALUE) === "[object Array]");
	},

	/**
	 * ```js
	 * [boolean] JS.IS_OBJECT([*] VALUE);
	 * ```
	 * CHECKS IF VARIABLE IS AN OBJECT
	 *
	 * **VALUE** - SEND ANY VARIABLE TYPE
	 *
	 * ----
	 *
	 * **return** - `true` IF VALUE/VARIABLE IS AN OBJECT.
	 */
	IS_OBJECT: function(VALUE)
	{
		if (VALUE === null)
			return (false);

		return (typeof(VALUE) === "object");
	},

	/**
	 * ```js
	 * [object] JS.CLONE([object] SOURCE);
	 * ```
	 * CLONES A TABLE, ARRAY OR AN OBJECT
	 *
	 * **SOURCE** - THE OBJECT THAT WANT TO BE COPIED
	 *
	 * ----
	 *
	 * **return** - THE COPY OF THE OBJECT
	 */
	CLONE: function(SOURCE)
	{
		if (SOURCE instanceof Node)
			return (SOURCE.cloneNode(true));

		if (JS.IS_ARRAY(SOURCE))
			return (SOURCE.slice());

		if (JS.IS_OBJECT(SOURCE))
		{
			var	TARGET = {};

			for (var KEY in SOURCE)
			{
				if (Object.prototype.hasOwnProperty.call(SOURCE, KEY))
					TARGET[KEY] = SOURCE[KEY];
			}

			return (TARGET);
		}

		return (SOURCE);
	},

	/**
	 * ```js
	 * [object] JS.MERGE([object] TARGET, [object] SOURCE);
	 * ```
	 * COMBINES THE SOURCE OBJECT WITH TARGET AND RETURNS THE TARGET
	 *
	 * **TARGET** - TARGET OBJECT
	 * 
	 * **SOURCE** - SOURCE OBJECT
	 *
	 * ----
	 *
	 * **return** - THE COPY OF THE OBJECT (TARGET)
	 */
	MERGE: function(TARGET, SOURCE)
	{
		if (JS.IS_ARRAY(TARGET) && JS.IS_ARRAY(SOURCE))
		{
			TARGET.push.apply(TARGET, SOURCE);
			return (TARGET);
		}

		if (JS.IS_OBJECT(TARGET) && JS.IS_OBJECT(SOURCE))
		{
			for (var KEY in SOURCE)
			{
				if (Object.prototype.hasOwnProperty.call(SOURCE, KEY))
					TARGET[KEY] = SOURCE[KEY];
			}

			return (TARGET);
		}

		return (TARGET);
	},

	/**
	 * ```js
	 * [void] JS.ITERATE([object|array] OBJECT, [function] FUNCTION);
	 * ```
	 * ITERATES EVERY VARIABLE INSIDE A FUNCTION
	 *
	 * **OBJECT** - OBJECT OR ARRAY TO ITERATE IN FUNCTION
	 * 
	 * **FUNCTION** - FUNCTION TO RUN EVERY ITERATION (VALUE, VARIABLE|INDEX)
	 *
	 */
	ITERATE: function(OBJECT, FUNCTION)
	{
		if (
			typeof(OBJECT) === "undefined" ||
			OBJECT === null ||
			typeof(FUNCTION) !== "function"
		)
			return ;

		if (JS.IS_ARRAY(OBJECT))
		{
			const	SIZE = OBJECT.length;

			for (let INDEX = 0; INDEX < SIZE; INDEX++)
				FUNCTION(OBJECT[INDEX], INDEX);
		}
		else if (JS.IS_OBJECT(OBJECT))
		{
			for (const KEY in OBJECT)
				if (Object.prototype.hasOwnProperty.call(OBJECT, KEY))
					FUNCTION(OBJECT[KEY], KEY);
		}
	},


	/**
	 * ```js
	 * [void] JS.ASYNC_ITERATE([object|array] OBJECT, [function] FUNCTION);
	 * ```
	 * ITERATES EVERY VARIABLE INSIDE AN ASYNC FUNCTION
	 *
	 * **OBJECT** - OBJECT OR ARRAY TO ITERATE IN FUNCTION
	 * 
	 * **FUNCTION** - FUNCTION TO RUN EVERY ITERATION (VALUE, VARIABLE|INDEX)
	 *
	 */
	ASYNC_ITERATE: async function(OBJECT, FUNCTION)
	{
		if (
			typeof(OBJECT) === "undefined" ||
			OBJECT === null ||
			typeof(FUNCTION) !== "function"
		)
			return ;

		if (JS.IS_ARRAY(OBJECT))
		{
			const	SIZE = OBJECT.length;

			for (let INDEX = 0; INDEX < SIZE; INDEX++)
				await FUNCTION(OBJECT[INDEX], INDEX);
		}
		else if (JS.IS_OBJECT(OBJECT))
		{
			for (const KEY in OBJECT)
				if (Object.prototype.hasOwnProperty.call(OBJECT, KEY))
					await FUNCTION(OBJECT[KEY], KEY);
		}
	},

	/**
	 * ```js
	 * [string] JS.TEMPLATE([string] TEMPLATE_STRING, [object] DATA);
	 * ```
	 * INTERPOLATE THE STRING INTO VARIABLES
	 *
	 * **TEMPLATE_STRING** - STRING TO INTERPOLATE
	 * 
	 * **DATA** - LIST OF THE VARIABLES THAT SHOULD BE INTERPOLATED TO STRING
	 *
	 * ----
	 *
	 * **return** - THE INTERPOLATED STRING
	 */
	TEMPLATE: function(TEMPLATE_STRING, DATA)
	{
		function
			SET_PATH(OBJ, PATH, VALUE)
		{
			var	STEP;

			if (typeof(PATH) === "string")
				PATH = PATH.split('.');

			if (PATH.length === 1 && typeof(VALUE) !== "undefined")
			{
				OBJ[PATH[0]] = VALUE;
				return ;
			}

			if (PATH.length === 0)
				return (OBJ);

			STEP = PATH.shift();

			if (
				typeof(VALUE) !== "undefined" &&
				typeof(OBJ[STEP]) === "undefined"
			)
				OBJ[STEP] = {};

			return (SET_PATH(OBJ[STEP], PATH, VALUE));
		}

		return (
			TEMPLATE_STRING.replace(
				/\$\{(.+?)\}/g,
				function(_, MATCH)
				{
					try
					{
						return (SET_PATH(DATA, MATCH) || "");
					}
					catch (ERROR)
					{
						return ("");
					}
				}
			)
		);
	}
};

/**
 * ```js
 *   [void] TITLE([string] NAME);
 *   [void] FAVICON([string] URL);
 * [object] POPUP([string] URL, [object|undefined]ATTRIBUTES);
 *   [void] REFRESH([object|undefined] WINDOW);
 *   [void] CLOSE([object|undefined] WINDOW);
 *
 *   [void] URL.GO([string] URL);
 *   [void] URL.NEW([string] URL);
 * [string] URL.GET([void]);
 *   [void] URL.SET([string] NEW_URL);
 * ```
 */
const	WINDOW =
{
	/**
	 * ```js
	 * [void] WINDOW.TITLE([string] NAME);
	 * ```
	 * CHANGES THE TITLE
	 *
	 * **NAME** - PAGE OR URL TO REDIRECT
	 */
	TITLE: function(NAME)
	{
		document.title = NAME;
	},

	/**
	 * ```js
	 * [void] WINDOW.FAVICON([string] URL);
	 * ```
	 * CHANGES THE ICON OF THE PAGE
	 *
	 * **URL** - URL OF THE NEW FAVICON TO SET
	 */
	FAVICON: function(URL)
	{
		const	LINKS = document.querySelectorAll(
			"link[rel='icon'], link[rel='shortcut icon']"
		);

		if (LINKS.length === 0)
		{
			const	LINK = document.createElement("link");

			LINK.rel = "icon";
			LINK.href = URL;
			document.head.appendChild(LINK);
		}
		else
		{
			LINKS.forEach(
				function(LINK)
				{
					LINK.href = URL;
					return (LINK);
				}
			);
		}
	},

	/**
	 * ```js
	 * [object] WINDOW.POPUP([string] URL, [object|undefined]ATTRIBUTES);
	 * ```
	 * CREATE A POPUP
	 *
	 * **URL** - THE NEW URL OF THE PAGE THE POPUP GOING TO OPEN
	 * 
	 * **ATTRIBUTES** - CUSTOMIZE THE POPUP
	 * 
	 * - **WIDTH** — POPUP WINDOW WIDTH IN PIXELS (DEFAULT: 600)
	 * - **HEIGHT** — POPUP WINDOW HEIGHT IN PIXELS (DEFAULT: 800)
	 * - **LEFT** — HORIZONTAL POSITION OF THE POPUP (DEFAULT: CENTER)
	 * - **TOP** — VERTICAL POSITION OF THE POPUP (DEFAULT: CENTER)
	 * - **TOOLBAR** — SHOW BROWSER TOOLBAR (`"YES"` / `"NO"`)
	 * - **LOCATION** — SHOW ADDRESS BAR (`"YES"` / `"NO"`)
	 * - **STATUS** — SHOW STATUS BAR (`"YES"` / `"NO"`)
	 * - **MENUBAR** — SHOW BROWSER MENU BAR (`"YES"` / `"NO"`)
	 * - **SCROLLBARS** — ALLOW SCROLLBARS (`"YES"` / `"NO"`)
	 * - **RESIZABLE** — ALLOW RESIZING THE POPUP (`"YES"` / `"NO"`)
	 * - **ONCLOSE** — CALLBACK FUNCTION EXECUTED WHEN POPUP IS MANUALLY CLOSED
	 */
	POPUP: function(URL, OPTIONS)
	{
		var	FEATURES = "";

		if (typeof(OPTIONS) === "undefined")
			OPTIONS = {};

		OPTIONS.width = OPTIONS.WIDTH || OPTIONS.width || 600;
		OPTIONS.height = OPTIONS.HEIGHT || OPTIONS.height || 800;
		OPTIONS.left = OPTIONS.LEFT || OPTIONS.left || (screen.width - OPTIONS.width) / 2;
		OPTIONS.top = OPTIONS.TOP || OPTIONS.top || (screen.height - OPTIONS.height) / 2;
		OPTIONS.toolbar = OPTIONS.TOOLBAR || OPTIONS.toolbar || "no";
		OPTIONS.location = OPTIONS.LOCATION || OPTIONS.location || "no";
		OPTIONS.status = OPTIONS.STATUS || OPTIONS.status || "no";
		OPTIONS.menubar = OPTIONS.MENUBAR || OPTIONS.menubar || "no";
		OPTIONS.scrollbars = OPTIONS.SCROLLBARS || OPTIONS.scrollbars || "yes";
		OPTIONS.resizable = OPTIONS.RESIZABLE || OPTIONS.resizable || "yes";
		OPTIONS.onclose = OPTIONS.ONCLOSE || OPTIONS.onclose;

		JS.ITERATE(
			OPTIONS,
			function(VALUE, KEY)
			{
				KEY = KEY.toLowerCase();

				if (KEY !== "onclose")
				{
					if (typeof(VALUE) === "string")
						FEATURES += (KEY + "=" + VALUE.toLowerCase() + ",");
					else
						FEATURES += (KEY + "=" + VALUE + ",");
				}
			}
		);

		const	POPUP = window.open(
			URL,
			null,
			FEATURES.substring(0, FEATURES.length - 1)
		);

		if (OPTIONS.onclose)
		{
			var	TIMER = setInterval(
				async function ()
				{
					if (POPUP.closed)
					{
						clearInterval(TIMER);

						try
						{
							await OPTIONS.onclose();
						}
						catch (ERROR) {}
					}
				},
				500
			);
		}

		return (POPUP);
	},

	/**
	 * ```js
	 * [void] WINDOW.REFRESH([object|undefined] WINDOW);
	 * ```
	 * REFRESH THE PAGE
	 */
	REFRESH: function(WINDOW)
	{
		WINDOW = WINDOW || window;
		WINDOW.location.reload(true);
	},

	/**
	 * ```js
	 * [void] WINDOW.CLOSE([object|undefined] WINDOW);
	 * ```
	 * CLOSES THE PAGE
	 */
	CLOSE: function(WINDOW)
	{
		WINDOW = WINDOW || window;
		WINDOW.close();
		WINDOW.location.href = "about:blank";
	},

	/**
	 * ```js
	 *   [void] GO([string] URL);
	 *   [void] NEW([string] URL);
	 * [string] GET([void]);
	 *   [void] SET([string] NEW_URL);
	 * ```
	 * MANAGE THE URL BAR OF THE PAGE
	 */
	URL:
	{
		/**
		 * ```js
		 * [void] WINDOW.URL.GO([string] URL);
		 * ```
		 * REDIRECTS TO WANTED URL
		 *
		 * **URL** - PAGE OR URL TO REDIRECT
		 */
		GO: function(URL)
		{
			window.location.href = URL;
		},

		/**
		 * ```js
		 * [void] WINDOW.URL.NEW([string] URL);
		 * ```
		 * OPENS A NEW TAB AND REDIRECTS IT TO WANTED URL
		 *
		 * **URL** - PAGE OR URL TO REDIRECT
		 */
		NEW: function(URL)
		{
			window.open(URL, "_blank");
		},

		/**
		 * ```js
		 * [string] WINDOW.URL.GET([void]);
		 * ```
		 * GET THE PAGE URL
		 */
		GET: function()
		{
			return (window.location.href);
		},

		/**
		 * ```js
		 * [void] WINDOW.URL.SET([string] NEW_URL);
		 * ```
		 * SET THE PAGE URL WITHOUT REDIRECTING
		 *
		 * **NEW_URL** - THE NEW URL OF THE PAGE
		 */
		SET: function(NEW_URL)
		{
			history.replaceState(null, "", NEW_URL);
		}
	}
};

/**
 * ```js
 *            [void] START([function] CALLBACK);
 *             [DOM] CREATE.ELEMENT([string] TAGNAME);
 *             [DOM] CREATE.STRING([string] HTML_STRING);
 *            [void] REMOVE([DOM] ELEMENT);
 *            [void] REPLACE([DOM] OLD_NODE, [DOM] NEW_NODE);
 *      [Array<DOM>] CHILDS([DOM] DOM_OBJECT);
 *        [DOM|null] PARENT([DOM] DOM_OBJECT);
 *
 *            [void] CLASS.ADD([DOM] ELEMENT, [string] CLASSNAME);
 *         [boolean] CLASS.CHECK([DOM] ELEMENT, [string] CLASSNAME);
 *            [void] CLASS.REMOVE([DOM] ELEMENT, [string] CLASSNAME);
 *
 *            [void] ATTRIBUTE.SET(
 *                   	[DOM] ELEMENT,
 *                   	[string] VARIABLE,
 *                   	[string] VALUE
 *                   );
 *          [string] ATTRIBUTE.GET([DOM] ELEMENT, [string] VARIABLE);
 *            [void] ATTRIBUTE.DELETE([DOM] ELEMENT, [string] VARIABLE);
 *
 *      [Array<DOM>] GET.ROOMMATES([DOM] ELEMENT);
 *        [DOM|null] GET.ID([string] ID_STRING);
 * [DOMS|Array<DOM>] GET.CLASS([string] CLASSNAME);
 * [DOMS|Array<DOM>] GET.ELEMENTS([string]TAGNAME);
 *            [DOMS] GET.NAME([string] TAGNAME);
 *            [DOMS] GET.ALL([string] HTML_STRING);
 *      [Array<DOM>] GET.ATTRIBUTE(
 *                   	[string] ATTR_NAME,
 *                   	[string|undefined] ATTR_VALUE
 *                   );
 *      [Array<DOM>] GET.CHILDS([DOM] DOM_OBJECT);
 *        [DOM|null] GET.PARENT([DOM] DOM_OBJECT);
 *
 *   [Promise<void>] LOAD_SVGS([void]);
 * ```
 */
const	DOM =
{
	/**
	 * ```js
	 * [void] DOM.START([function] CALLBACK);
	 * ```
	 * EXECUTES FUNCTION WHEN DOCUMENT IS READY
	 *
	 * **CALLBACK** - FUNCTION TO RUN WHEN DOM IS LOADED
	 */
	START: function(CALLBACK)
	{
		if (document.addEventListener)
			document.addEventListener("DOMContentLoaded", CALLBACK);
		else if (document.attachEvent)
		{
			document.attachEvent(
				"onreadystatechange",
				function()
				{
					if (document.readyState === "complete")
						CALLBACK();
				}
			);
		}
		else
			window.onload = CALLBACK;
	},

	/**
	 * ```js
	 * [DOM] ELEMENT([string] TAGNAME);
	 * [DOM] STRING([string] HTML_STRING);
	 * ```
	 * HELPERS TO CREATE ELEMENTS FROM TAG OR STRING
	 */
	CREATE:
	{
		/**
		 * ```js
		 * [DOM] DOM.CREATE.ELEMENT([string] TAGNAME);
		 * ```
		 * CREATES ELEMENT BY TAG NAME
		 */
		ELEMENT: function(TAGNAME){return (document.createElement(TAGNAME));},

		/**
		 * ```js
		 * [DOM] DOM.CREATE.STRING([string] HTML_STRING);
		 * ```
		 * CREATES ELEMENT FROM RAW HTML STRING
		 */
		STRING: function(HTML_STRING)
		{
			var	TEMPLATE;

			TEMPLATE = document.createElement("template");
			TEMPLATE.innerHTML = HTML_STRING.trim();
			return (TEMPLATE.content.firstChild);
		}
	},

	/**
	 * ```js
	 * [void] REMOVE([DOM] ELEMENT);
	 * ```
	 * REMOVES THE ELEMENT
	 */
	REMOVE: function(ELEMENT)
	{
		if (!(ELEMENT instanceof Element) && !(ELEMENT instanceof Node))
			return ;

		if (typeof(ELEMENT.remove) === "function")
			ELEMENT.remove();
		else
			ELEMENT.parentNode.removeChild(ELEMENT);
	},

	/**
	 * ```js
	 * [void] DOM.REPLACE([DOM] OLD_NODE, [DOM] NEW_NODE);
	 * ```
	 * REPLACES OLD DOM NODE WITH NEW ONE
	 */
	REPLACE: function(OLD_NODE, NEW_NODE)
	{
		if (typeof(OLD_NODE) !== "undefined" && OLD_NODE.parentNode)
			OLD_NODE.parentNode.replaceChild(NEW_NODE, OLD_NODE);
	},

	/**
	 * ```js
	 *    [void] ADD([DOM] ELEMENT, [string] CLASSNAME);
	 * [boolean] CHECK([DOM] ELEMENT, [string] CLASSNAME);
	 *    [void] REMOVE([DOM] ELEMENT, [string] CLASSNAME);
	 * ```
	 * CLASS HELPERS FOR DOM ELEMENTS
	 */
	CLASS:
	{
		/**
		 * ```js
		 * [void] DOM.CLASS.ADD([DOM] ELEMENT, [string] CLASSNAME);
		 * ```
		 * ADDS A CSS CLASS TO THE ELEMENT IF IT DOESN'T EXIST
		 *
		 * **ELEMENT** - TARGET DOM ELEMENT  
		 * **CLASSNAME** - NAME OF THE CLASS TO ADD
		 */
		ADD: function(ELEMENT, CLASSNAME)
		{
			if (!DOM.CLASS.CHECK(ELEMENT, CLASSNAME))
			{
				if (ELEMENT.classList)
					ELEMENT.classList.add(CLASSNAME);
				else
				{
					if (ELEMENT.className)
						ELEMENT.className = ELEMENT.className + " " + CLASSNAME;
					else
						ELEMENT.className = CLASSNAME;
				}
			}
		},

		/**
		 * ```js
		 * [boolean] DOM.CLASS.CHECK([DOM] ELEMENT, [string] CLASSNAME);
		 * ```
		 * CHECKS IF THE ELEMENT HAS A SPECIFIC CSS CLASS
		 *
		 * **ELEMENT** - TARGET DOM ELEMENT
		 * 
		 * **CLASSNAME** - NAME OF THE CLASS TO CHECK
		 *
		 * ----
		 *
		 * **return** - `true` IF ELEMENT HAS CLASS, `false` OTHERWISE
		 */
		CHECK: function(ELEMENT, CLASSNAME)
		{
			if (ELEMENT.classList)
				return (ELEMENT.classList.contains(CLASSNAME));

			return (
				new RegExp("(^|\\s)" + CLASSNAME + "(\\s|$)").test(
					ELEMENT.className
				)
			);
		},

		/**
		 * ```js
		 * [void] DOM.CLASS.REMOVE([DOM] ELEMENT, [string] CLASSNAME);
		 * ```
		 * REMOVES A CSS CLASS FROM THE ELEMENT
		 *
		 * **ELEMENT** - TARGET DOM ELEMENT
		 * 
		 * **CLASSNAME** - NAME OF THE CLASS TO REMOVE
		 */
		REMOVE: function(ELEMENT, CLASSNAME)
		{
			if (
				ELEMENT.classList &&
				typeof(ELEMENT.classList.remove) === "function"
			)
				ELEMENT.classList.remove(CLASSNAME);
			else
			{
				ELEMENT.className = ELEMENT.className.replace(
					new RegExp("(^|\\s)" + CLASSNAME + "(\\s|$)", "g"),
					" "
				).trim();
			}
		}
	},

	/**
	 * ```js
	 *   [void] SET([DOM] ELEMENT, [string] VARIABLE, [string|undefined] VALUE);
	 * [string] GET([DOM] ELEMENT, [string] VARIABLE);
	 * ```
	 * ATTRIBUTE SETTINGS
	 */
	ATTRIBUTE:
	{
		/**
		 * ```js
		 * [void] DOM.ATTRIBUTE.SET(
		 *        	[DOM] ELEMENT,
		 *        	[string] VARIABLE,
		 *        	[string|undefined] VALUE
		 *        );
		 * ```
		 * SETS AN ATTRIBUTE INSIDE A DOM ELEMENT
		 *
		 * **ELEMENT** - TARGET ELEMENT
		 * **VARIABLE** - TARGET ATTRIBUTE VARIABLE
		 * **VALUE** - VALUE TO SET INSIDE ATTRIBUTE
		 *
		 */
		SET: function(ELEMENT, VARIABLE, VALUE)
		{
			ELEMENT.setAttribute(VARIABLE, VALUE);
		},

		/**
		 * ```js
		 * [string] DOM.ATTRIBUTE.GET([DOM] ELEMENT, [string] VARIABLE);
		 * ```
		 * GETS AN ATTRIBUTE FROM A DOM ELEMENT
		 *
		 * **ELEMENT** - TARGET ELEMENT
		 * **VARIABLE** - TARGET ATTRIBUTE VARIABLE
		 *
		 * ----
		 *
		 * **return** - VALUE OF ATTRIBUTE
		 */
		GET: function(ELEMENT, VARIABLE)
		{
			const	ATTRIBUTE = ELEMENT.getAttribute(VARIABLE);

			if (ATTRIBUTE === null)
				return (undefined);

			return (ATTRIBUTE);
		},

		/**
		 * ```js
		 * [void] DOM.ATTRIBUTE.DELETE(
		 *        	[DOM] ELEMENT,
		 *        	[string] VARIABLE
		 *        );
		 * ```
		 * DELETES AN ATTRIBUTE INSIDE A DOM ELEMENT
		 *
		 * **ELEMENT** - TARGET ELEMENT
		 * **VARIABLE** - TARGET ATTRIBUTE VARIABLE
		 *
		 */
		DELETE: function(ELEMENT, VARIABLE)
		{
			ELEMENT.removeAttribute(VARIABLE);
		}
	},

	/**
	 * ```js
	 *      [Array<DOM>] ROOMMATES([DOM] ELEMENT);
	 *        [DOM|null] ID([string] ID_STRING);
	 * [DOMS|Array<DOM>] CLASS([string] CLASSNAME);
	 *            [DOMS] NAME([string] TAGNAME);
	 *            [DOMS] ALL([string] HTML_STRING);
	 *      [Array<DOM>] ATTRIBUTE(
	 *                   	[string] ATTR_NAME,
	 *                   	[string|undefined] ATTR_VALUE
	 *                   );
	 *      [Array<DOM>] CHILDS([DOM] DOM_OBJECT);
	 *        [DOM|null] PARENT([DOM] DOM_OBJECT);
	 * ```
	 * GETTERS FOR DOM ELEMENTS
	 */
	GET:
	{
		/**
		 * ```js
		 * [Array<DOM>] DOM.GET.ROOMMATES([DOM] ELEMENT);
		 * ```
		 * GETS ALL ELEMENTS THAT SHARE THE SAME PARENT EXCLUDING THE ELEMENT
		 * ITSELF
		 *
		 * **ELEMENT** - TARGET ELEMENT
		 *
		 * ----
		 *
		 * **return** - ARRAY OF SIBLING ELEMENTS
		 */
		ROOMMATES: function(ELEMENT)
		{
			if (typeof(ELEMENT) === "undefined" || !ELEMENT.parentNode)
				return ([]);

			return (
				Array.prototype.filter.call(
					ELEMENT.parentNode.children,
					function(ELEMENT_NODE)
					{
						return (ELEMENT_NODE !== ELEMENT);
					}
				)
			);
		},

		/**
		 * ```js
		 * [DOM|null] DOM.GET.ID([string] ID_STRING);
		 * [DOM|null] DOM.GET.ID([DOM]DOM, [string] ID_STRING);
		 * ```
		 * GET ELEMENT BY ID
		 *
		 * **ID_STRING** - THE ID OF THE ELEMENT
		 *
		 * ----
		 *
		 * **return** - ELEMENT IF FOUND, OTHERWISE `null`
		 */
		ID: function(ARG_1, ARG_2)
		{
			var	DOM_OBJECT = undefined;
			var	ID_STRING = undefined;

			if (ARG_1 instanceof Element || ARG_1 instanceof Document)
			{
				DOM_OBJECT = ARG_1;
				ID_STRING = ARG_2;
			}
			else
			{
				DOM_OBJECT = document;
				ID_STRING = ARG_1;
			}

			return (DOM_OBJECT.getElementById(ID_STRING));
		},

		/**
		 * ```js
		 * [DOMS|Array<DOM>] DOM.GET.CLASS([string]CLASSNAME);
		 * [DOMS|Array<DOM>] DOM.GET.CLASS([DOM]DOM, [string]CLASSNAME);
		 * ```
		 * GET ELEMENTS BY CLASS NAME
		 *
		 * **CLASSNAME** - THE CLASS NAME TO SEARCH
		 *
		 * ----
		 *
		 * **return** - COLLECTION OR ARRAY OF ELEMENTS
		 */
		CLASS: function(ARG_1, ARG_2)
		{
			var	CLASSNAME = undefined;
			var	DOM_OBJECT = undefined;

			if (ARG_1 instanceof Element || ARG_1 instanceof Document)
			{
				DOM_OBJECT = ARG_1;
				CLASSNAME = ARG_2;
			}
			else
			{
				CLASSNAME = ARG_1;
				DOM_OBJECT = document;
			}

			if (DOM_OBJECT.getElementsByClassName)
				return (DOM_OBJECT.getElementsByClassName(CLASSNAME));

			var	ALL = DOM_OBJECT.getElementsByTagName("*");
			var	OUT = [];

			for (var INDEX = 0; INDEX < ALL.length; INDEX++)
			{
				if (
					(new RegExp("(^|\\s)" + CLASSNAME + "(\\s|$)")).test(
						ALL[INDEX].className
					)
				)
					OUT.push(ALL[INDEX]);
			}

			return (OUT);
		},

		/**
		 * ```js
		 * [DOMS|Array<DOM>] DOM.GET.ELEMENTS([string]TAGNAME);
		 * [DOMS|Array<DOM>] DOM.GET.ELEMENTS([DOM]DOM, [string]TAGNAME);
		 * ```
		 * GET ELEMENTS BY TAG NAME
		 *
		 * **TAGNAME** - THE TAG NAME TO SEARCH
		 *
		 * ----
		 *
		 * **return** - COLLECTION OR ARRAY OF ELEMENTS
		 */
		ELEMENTS: function(ARG_1, ARG_2)
		{
			var	TAGNAME = undefined;
			var	DOM_OBJECT = undefined;

			if (ARG_1 instanceof Element || ARG_1 instanceof Document)
			{
				DOM_OBJECT = ARG_1;
				TAGNAME = ARG_2;
			}
			else
			{
				TAGNAME = ARG_1;
				DOM_OBJECT = document;
			}

			return (DOM_OBJECT.getElementsByTagName(TAGNAME));
		},

		/**
		 * ```js
		 * [DOMS] DOM.GET.NAME([string] TAGNAME);
		 * [DOMS] DOM.GET.NAME([DOM]DOM, [string] TAGNAME);
		 * ```
		 * GET ELEMENTS BY TAG NAME
		 *
		 * **TAGNAME** - TAG NAME TO SEARCH
		 *
		 * ----
		 *
		 * **return** - COLLECTION OF ELEMENTS
		 */
		NAME: function(ARG_1, ARG_2)
		{
			var	DOM_OBJECT = undefined;
			var	TAGNAME = undefined;

			if (ARG_1 instanceof Element || ARG_1 instanceof Document)
			{
				DOM_OBJECT = ARG_1;
				TAGNAME = ARG_2;
			}
			else
			{
				DOM_OBJECT = document;
				TAGNAME = ARG_1;
			}

			return (DOM_OBJECT.getElementsByTagName(TAGNAME));
		},

		/**
		 * ```js
		 * [DOMS] DOM.GET.ALL([string] HTML_STRING);
		 * [DOMS] DOM.GET.ALL([DOM]DOM, [string] HTML_STRING);
		 * ```
		 * GET ELEMENTS BY TAG NAME
		 *
		 * **HTML_STRING** - TAG NAME TO SEARCH
		 *
		 * ----
		 *
		 * **return** - COLLECTION OF ELEMENTS
		 */
		ALL: function(ARG_1, ARG_2)
		{
			var	DOM_OBJECT = undefined;
			var	HTML_STRING = undefined;

			if (ARG_1 instanceof Element || ARG_1 instanceof Document)
			{
				DOM_OBJECT = ARG_1;
				HTML_STRING = ARG_2;
			}
			else
			{
				DOM_OBJECT = document;
				HTML_STRING = ARG_1;
			}

			if (typeof(DOM_OBJECT.querySelectorAll) === "function")
				return (DOM_OBJECT.querySelectorAll(HTML_STRING));

			return (DOM_OBJECT.getElementsByTagName(HTML_STRING));
		},

		/**
		 * ```js
		 * [Array<DOM>] DOM.GET.ATTRIBUTE(
		 * 	[string] ATTR_NAME,
		 * 	[string|undefined] ATTR_VALUE
		 * );
		 * ```
		 * GET ELEMENTS BY ATTRIBUTE AND OPTIONAL VALUE
		 *
		 * **ATTR_NAME** - ATTRIBUTE NAME
		 * 
		 * **ATTR_VALUE** - OPTIONAL ATTRIBUTE VALUE TO MATCH
		 *
		 * ----
		 *
		 * **return** - ARRAY OF ELEMENTS MATCHING ATTRIBUTE
		 */
		ATTRIBUTE: function(ATTR_NAME, ATTR_VALUE){
			var	ALL;
			var	OUT;

			ALL = document.getElementsByTagName("*");
			OUT = [];

			for (var INDEX = 0; INDEX < ALL.length; INDEX++)
			{
				var	ATTRIBUTE = ALL[INDEX].getAttribute(ATTR_NAME);

				if (
					typeof(ATTRIBUTE) !== "undefined" &&
					(
						typeof(ATTR_VALUE) === "undefined" ||
						ATTRIBUTE === ATTR_VALUE
					)
				)
					OUT.push(ALL[INDEX]);
			}

			return (OUT);
		},

		/**
		 * ```js
		 * [Array<DOM>] DOM.GET.CHILDS([DOM] DOM_OBJECT);
		 * ```
		 * GETS ONLY CHILD ELEMENT NODES
		 *
		 * **DOM_OBJECT** - TARGET ELEMENT
		 *
		 * ----
		 *
		 * **return** - ARRAY OF CHILD ELEMENTS
		 */
		CHILDS: function(DOM_OBJECT)
		{
			var	OUT = [];

			for (let INDEX = 0; INDEX < DOM_OBJECT.childNodes.length; INDEX++)
			{
				if (DOM_OBJECT.childNodes[INDEX].nodeType === 1)
					OUT.push(DOM_OBJECT.childNodes[INDEX]);
			}

			return (OUT);
		},

		/**
		 * ```js
		 * [DOM|null] DOM.GET.PARENT([DOM] DOM_OBJECT);
		 * ```
		 * GETS PARENT NODE OF ELEMENT
		 *
		 * **DOM_OBJECT** - TARGET ELEMENT
		 *
		 * ----
		 *
		 * **return** - PARENT ELEMENT OR `null`
		 */
		PARENT: function(DOM_OBJECT)
		{
			return (DOM_OBJECT.parentNode);
		}
	},

	/**
	 * ```js
	 * [Array<DOM>] DOM.CHILDS([DOM] DOM_OBJECT);
	 * ```
	 * GETS ONLY CHILD ELEMENT NODES
	 *
	 * **DOM_OBJECT** - TARGET ELEMENT
	 *
	 * ----
	 *
	 * **return** - ARRAY OF CHILD ELEMENTS
	 */
	CHILDS: function(DOM_OBJECT)
	{
		let	OUT = [];

		for (let INDEX = 0; INDEX < DOM_OBJECT.childNodes.length; INDEX++)
		{
			if (DOM_OBJECT.childNodes[INDEX].nodeType === 1)
				OUT.push(DOM_OBJECT.childNodes[INDEX]);
		}

		return (OUT);
	},

	/**
	 * ```js
	 * [DOM|null] DOM.PARENT([DOM] DOM_OBJECT);
	 * ```
	 * GETS PARENT NODE OF ELEMENT
	 *
	 * **DOM_OBJECT** - TARGET ELEMENT
	 *
	 * ----
	 *
	 * **return** - PARENT ELEMENT OR `null`
	 */
	PARENT: function(DOM_OBJECT)
	{
		return (DOM_OBJECT.parentNode);
	},

	/**
	 * ```js
	 * [Promise<void>] DOM.LOAD_SVGS([void]);
	 * ```
	 * LOADS INLINE SVGS FROM `src` ATTRIBUTE INTO THE DOM
	 */
	LOAD_SVGS: async function()
	{
		var	SVG_NODES;

		SVG_NODES = Array.from(document.querySelectorAll("svg[src]"));

		for (var INDEX = 0; INDEX < SVG_NODES.length; INDEX++)
		{
			var	SRC;

			SRC = SVG_NODES[INDEX].getAttribute("src");

			if (typeof(SRC) !== "undefined")
			{
				try
				{
					var	SVG_TEXT;

					SVG_TEXT = await AJAX.GET(SRC.trim());

					if (typeof(SVG_TEXT) !== "undefined")
					{
						var	TEMP = document.createElement("div");
						var	NEW_SVG;

						TEMP.innerHTML = SVG_TEXT;
						NEW_SVG = TEMP.querySelector("svg");

						if (NEW_SVG)
							SVG_NODES[INDEX].replaceWith(NEW_SVG);

						TEMP.remove();
					}
				}
				catch (ERROR) {}
			}
		}
	}
};

/**
 * ```js
 * [Promise<string|undefined>] GET([string] URL);
 *           [Promise<object>] POST([string] URL, [object|undefined] BODY);
 *    [Promise<string|object>] DATA([string] URL, [object|FormData|Blob] DATA);
 * ```
 */
const	AJAX =
{
	/**
	 * ```js
	 * [Promise<string|undefined>] AJAX.GET([string] URL);
	 * ```
	 * MAKES A SIMPLE HTTP GET REQUEST
	 *
	 * **URL** - THE REQUEST URL
	 *
	 * ----
	 *
	 * **return** - A PROMISE THAT RESOLVES TO RESPONSE TEXT OR `undefined` IF
	 *              FAILED
	 */
	GET: async function(URL)
	{
		return (
			new Promise(
				function(RESOLVE)
				{
					var XHR = new XMLHttpRequest();
					XHR.open("GET", URL, true);
					XHR.onreadystatechange = function()
					{
						if (XHR.readyState === 4)
						{
							if (XHR.status === 200)
								RESOLVE(XHR.responseText);
							else
								RESOLVE(undefined);
						}
					};
					XHR.send();
				}
			)
		);
	},

	/**
	 * ```js
	 * [Promise<object|string>] AJAX.POST(
	 * 	[string] URL,
	 * 	[object|undefined] BODY
	 * );
	 * ```
	 * MAKES AN HTTP POST REQUEST WITH JSON BODY
	 *
	 * **URL** - THE REQUEST URL
	 * 
	 * **BODY** - JSON OBJECT TO SEND (OPTIONAL)
	 *
	 * ----
	 *
	 * **return** - A PROMISE THAT RESOLVES TO PARSED RESPONSE OR RAW TEXT
	 */
	POST: async function(URL, BODY)
	{
		if (typeof(BODY) === "undefined")
			BODY = {};

		return (
			new Promise(
				function(RESOLVE)
				{
					var	XHR;

					XHR = new XMLHttpRequest();
					XHR.open("POST", URL, true);
					XHR.setRequestHeader("Content-Type", "application/json");
					XHR.onreadystatechange = function()
					{
						if (XHR.readyState === 4)
						{
							if (XHR.status === 200)
							{
								try
								{
									var	PARSED;

									PARSED = JSON.parse(XHR.responseText);
									PARSED.STATUS = 0;
									RESOLVE(PARSED);
								}
								catch (ERROR)
								{
									RESOLVE(XHR.responseText);
								}
							}
							else
							{
								try
								{
									var	PARSED;

									PARSED = JSON.parse(XHR.responseText);
									PARSED.STATUS = XHR.status;
									PARSED.MESSAGE = XHR.statusText;
									RESOLVE(PARSED);
								}
								catch (ERROR)
								{
									RESOLVE(
										{
											STATUS: XHR.status,
											MESSAGE: XHR.statusText
										}
									);
								}
							}
						}
					};
					try
					{
						XHR.send(JSON.stringify(BODY));
					}
					catch (ERROR)
					{
						RESOLVE({STATUS: -1, MESSAGE: ERROR.message});
					}
				}
			)
		);
	},

	/**
	 * ```js
	 * [Promise<string|object>] AJAX.DATA(
	 * 	[string] URL,
	 * 	[object|FormData|Blob] DATA
	 * );
	 * ```
	 * MAKES A POST REQUEST WITH ANY TYPE OF DATA
	 *
	 * **URL** - TARGET ENDPOINT
	 * 
	 * **DATA** - DATA OBJECT, JSON, `FormData` OR `Blob`
	 *
	 * ----
	 *
	 * **return** - A PROMISE THAT RESOLVES TO RESPONSE TEXT OR OBJECT
	 */
	DATA: async function(URL, DATA)
	{
		return (
			new Promise(
				function(RESOLVE, REJECT)
				{
					var	XHR;

					XHR = new XMLHttpRequest();
					XHR.open("POST", URL, true);
					XHR.onreadystatechange = function()
					{
						if (XHR.readyState === 4)
						{
							if (XHR.status === 200)
								RESOLVE(XHR.responseText);
							else
							{
								REJECT(
									{
										STATUS: XHR.status,
										MESSAGE: XHR.statusText
									}
								);
							}
						}
					};

					if (
						DATA instanceof Blob ||
						(
							typeof(FormData) !== "undefined" &&
							DATA instanceof FormData
						)
					)
						XHR.send(DATA);
					else
					{
						XHR.setRequestHeader(
							"Content-Type",
							"application/json"
						);

						try
						{
							if (DATA)
								XHR.send(JSON.stringify(DATA));
							else
								XHR.send(undefined);
						}
						catch (ERROR)
						{
							REJECT({STATUS: -1, MESSAGE: ERROR.message});
						}
					}
				}
			)
		);
	}
};

/**
 * ```js
 *     [WebSocket] OPEN([string] PATH);
 * [Promise<void>] WAIT([WebSocket] SOCKET);
 *        [number] CHECK([WebSocket] SOCKET);
 * ```
 */
const	WS =
{
	OPENED:
		(window.WebSocket && window.WebSocket.OPEN) ||
		(window.MSWebSocket && window.MSWebSocket.OPEN) || 1,

	CLOSED:
		(window.WebSocket && window.WebSocket.CLOSED) ||
		(window.MSWebSocket && window.MSWebSocket.CLOSED) || 3,

	/**
	 * ```js
	 * [WebSocket] WS.OPEN([string] PATH);
	 * ```
	 * CREATES NEW WEBSOCKET CONNECTION USING CURRENT HOST
	 *
	 * **PATH** - SOCKET PATH (WITHOUT HOST)
	 *
	 * ----
	 *
	 * **return** - A `WebSocket` INSTANCE
	 */
	OPEN: function(PATH)
	{
		var	WS_CONSTRUCTOR = (
			window.WebSocket ||
			window.MozWebSocket ||
			window.MSWebSocket
		);
		var	HOSTNAME = location.hostname;
		var	SCHEME = "wss://";

		if (!WS_CONSTRUCTOR)
			throw (new Error("WebSocket not supported"));

		if (HOSTNAME === "localhost" || HOSTNAME === "127.0.0.1")
			SCHEME = "ws://";

		return (new WS_CONSTRUCTOR(SCHEME + location.host + "/" + PATH));
	},

	/**
	 * ```js
	 * [Promise<void>] WS.WAIT([WebSocket] SOCKET);
	 * ```
	 * WAITS UNTIL SOCKET CONNECTION OPENS
	 *
	 * **SOCKET** - WEBSOCKET INSTANCE TO WAIT FOR
	 *
	 * ----
	 *
	 * **return** - RESOLVES WHEN SOCKET IS OPEN
	 */
	WAIT: function(SOCKET)
	{
		return (
			new Promise(
				function(RESOLVE)
				{
					function
						ON_OPEN()
					{
						SOCKET.removeEventListener("open", ON_OPEN);
						RESOLVE(true);
					}

					if (SOCKET.readyState === WS.OPENED)
						return (RESOLVE(true));

					if (SOCKET.readyState === WS.CLOSED)
						return (RESOLVE(false));

					SOCKET.addEventListener("open", ON_OPEN);
				}
			)
		);
	},

	/**
	 * ```js
	 * [number] WS.CHECK([WebSocket] SOCKET);
	 * ```
	 * CHECKS IF A WEBSOCKET IS CURRENTLY OPEN AND WORKING
	 *
	 * **SOCKET** - A `WebSocket` OBJECT TO CHECK
	 *
	 * ----
	 *
	 * **return** - RETURNS THE STATUS OF THE WEB SOCKET
	 *
	 * - **0** - STILL CONNECTING
	 * - **1** - CONNECTED
	 * - **2** - CLOSING
	 * - **3** - CLOSED
	 * - **4** - SOCKET DOESN'T EXIST
	 */
	CHECK: function(SOCKET)
	{
		if (!SOCKET || typeof(SOCKET.readyState) !== "number")
			return (4);

		return (SOCKET.readyState);
	}
};

/**
 * ```js
 *    [void] SET([string] KEY, [any] VALUE);
 *     [any] GET([string] KEY);
 *    [void] REMOVE([string] KEY);
 * [boolean] CHECK([string] KEY);
 * ```
 */
const	LOCAL_STORAGE =
{
	/**
	 * ```js
	 * [void] SET([string] KEY, [any] VALUE);
	 * ```
	 * SET A LOCAL STORAGE
	 *
	 * **KEY** - LOCAL STORAGE NAME
	 * **VALUE** - THE VALUE LOCAL STORAGE HOLDS
	 */
	SET: function (KEY, VALUE)
	{
		let	TYPE = typeof(VALUE);

		if (VALUE === null)
			TYPE = "null";

		localStorage.setItem(
			KEY,
			JSON.stringify(
				{
					TYPE: TYPE,
					VALUE: VALUE
				}
			)
		);
	},

	/**
	 * ```js
	 * [any] GET([string] KEY);
	 * ```
	 * GET A LOCAL STORAGE
	 *
	 * **KEY** - LOCAL STORAGE TO GET
	 *
	 * ----
	 *
	 * **return** - VALUE OF LOCAL STORAGE
	 */
	GET: function (KEY)
	{
		const	RAW = localStorage.getItem(KEY);

		if (RAW === null)
		{
			this.REMOVE(KEY);
			return (undefined);
		}

		if (typeof(RAW) === "undefined")
			return (undefined);

		const	PARSED = JSON.parse(RAW);

		switch (PARSED.TYPE)
		{
			case ("number"): return (Number(PARSED.VALUE));
			case ("boolean"): return (Boolean(PARSED.VALUE));
			case ("string"): return (String(PARSED.VALUE));
			case ("object"): return (PARSED.VALUE);
			case ("null"): return (null);
			default: return (PARSED.VALUE);
		}
	},

	/**
	 * ```js
	 * [void] REMOVE([string] KEY);
	 * ```
	 * REMOVE A LOCAL STORAGE
	 *
	 * **KEY** - LOCAL STORAGE NAME TO REMOVE
	 */
	REMOVE: function (KEY)
	{
		localStorage.removeItem(KEY);
	},

	/**
	 * ```js
	 * [boolean] CHECK([string] KEY);
	 * ```
	 * CHECK IF LOCAL STROAGE IS EXIST OR NOT
	 *
	 * **KEY** - LOCAL STORAGE NAME TO CHECK
	 */
	CHECK: function (KEY)
	{
		const	VALUE = localStorage.getItem(KEY);

		return (typeof(VALUE) !== "undefined" && VALUE !== null);
	}
};
