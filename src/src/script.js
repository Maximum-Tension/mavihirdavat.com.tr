/******************************************************************************\
# JS - script                                    #       Maximum Tension       #
################################################################################
#                                                #      -__            __-     #
# Teoman Deniz                                   #  :    :!1!-_    _-!1!:    : #
# maximum-tension.com                            #  ::                      :: #
#                                                #  :!:    : :: : :  :  ::::!: #
# +.....................++.....................+ #   :!:: :!:!1:!:!::1:::!!!:  #
# : C - Maximum Tension :: Create - 2026/09/12 : #   ::!::!!1001010!:!11!!::   #
# :---------------------::---------------------: #   :!1!!11000000000011!!:    #
# : License - MIT       :: Update - 2026/10/15 : #    ::::!!!1!!1!!!1!!!::     #
# +.....................++.....................+ #       ::::!::!:::!::::      #
\******************************************************************************/

const	body = DOM.GET.ID("body");
const	header = DOM.GET.ID("header");
const	burger = DOM.GET.ID("burger");
const	form_name = DOM.GET.ID("form_name");
const	form_phone = DOM.GET.ID("form_phone");
const	form_email = DOM.GET.ID("form_email");
const	form_group = DOM.GET.ID("form_group");
const	form_message = DOM.GET.ID("form_message");
const	form_whatsapp_link = DOM.GET.ID("form_whatsapp_link");
const	year_date = DOM.GET.ID("year_date");
const	plate = DOM.GET.ID("plate");

const	whatsapp_number = "905442648314";
const	mobile_width = 980;
const	scroll_limit = 8;
const	reduced_motion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

// HANG TAGS: EACH ONE IS A PENDULUM ON ITS PEG, PUSHED BY THE AIR AROUND THE MOUSE
const	tag_peg = 13;           // PX FROM THE TOP OF A TAG TO ITS PEG (CSS transform-origin)
const	tag_reach = 150;        // PX AROUND A TAG WHERE MOVING AIR IS FELT
const	tag_push = 2.6;         // HOW HARD MOVING AIR PUSHES
const	tag_scroll_push = 0.5;  // AIR FROM THE WALL MOVING UNDER A STILL MOUSE
const	tag_frequency = 6.2;    // RAD/S FOR A 196 PX TAG, SHORTER TAGS SWING FASTER
const	tag_damping = 2.2;      // HOW QUICKLY A SWING DIES OUT
const	tag_max_speed = 7;      // RAD/S
const	tag_rest = 0.0005;      // RAD, BELOW THIS A TAG IS STILL
const	tag_drop_time = 420;    // MS, FALL ONTO THE PEG WHEN THE WALL SCROLLS IN
const	tag_drop_tilt = 0.16;   // RAD, LARGEST TILT A TAG FALLS WITH

var		scroll = null;
var		tags = [];
var		tags_frame = 0;
var		tags_time = 0;
var		air_x = null;
var		air_y = 0;
var		air_time = 0;
var		air_client_x = 0;
var		air_client_y = 0;
var		air_mouse = false;
var		drawers = [];
var		screws = [];
var		scrub_frame = 0;

function
	to_array(collection)
{
	return (Array.prototype.slice.call(collection));
}

function
	clamp(value, low, high)
{
	return (Math.max(low, Math.min(high, value)));
}

function
	whatsapp_url(message)
{
	return ("https://wa.me/" + whatsapp_number + "?text=" + encodeURIComponent(message));
}

function
	value_or_dash(value)
{
	if (value.length === 0)
		return ("-");

	return (value);
}

function
	on_scroll()
{
	const	scroll_y = window.scrollY || window.pageYOffset || 0;

	if (scroll_y > scroll_limit)
		DOM.CLASS.ADD(header, "scrolled");
	else
		DOM.CLASS.REMOVE(header, "scrolled");

	air_from_scroll();
	scrub_soon();
}

function
	on_resize()
{
	if (window.innerWidth >= mobile_width)
		close_menu();

	scrub_soon();
}

function
	on_key(event)
{
	if (event.key === "Escape" || event.keyCode === 27)
		close_menu();
}

function
	open_menu()
{
	DOM.CLASS.ADD(body, "menu_open");
	DOM.ATTRIBUTE.SET(burger, "aria-expanded", "true");
	DOM.ATTRIBUTE.SET(burger, "aria-label", strings[5]);
}

function
	close_menu()
{
	DOM.CLASS.REMOVE(body, "menu_open");
	DOM.ATTRIBUTE.SET(burger, "aria-expanded", "false");
	DOM.ATTRIBUTE.SET(burger, "aria-label", strings[4]);
}

function
	toggle_menu()
{
	if (DOM.CLASS.CHECK(body, "menu_open"))
		close_menu();
	else
		open_menu();
}

/* ************************** [v] WHATSAPP LINKS [v] ************************* */
function
	update_whatsapp_links()
{
	const	url = whatsapp_url(strings[0]);

	JS.ITERATE(
		to_array(DOM.GET.CLASS("whatsapp_link")),
		function(link)
		{
			link.href = url;
		}
	);
}

function
	update_brand_links()
{
	JS.ITERATE(
		to_array(DOM.GET.CLASS("brand_tag")),
		function(link)
		{
			link.href = whatsapp_url(
				JS.TEMPLATE(strings[3], {brand: DOM.ATTRIBUTE.GET(link, "data-brand")})
			);
		}
	);
}

function
	update_group_links()
{
	JS.ITERATE(
		to_array(DOM.GET.CLASS("group_whatsapp")),
		function(link)
		{
			link.href = whatsapp_url(
				JS.TEMPLATE(strings[2], {group: DOM.ATTRIBUTE.GET(link, "data-group")})
			);
		}
	);
}

function
	update_form_link()
{
	const	message = strings[0] + JS.TEMPLATE(
		strings[1],
		{
			name: value_or_dash(form_name.value),
			phone: value_or_dash(form_phone.value),
			email: value_or_dash(form_email.value),
			group: value_or_dash(form_group.value),
			message: value_or_dash(form_message.value)
		}
	);

	form_whatsapp_link.href = whatsapp_url(message);
}
/* ************************** [^] WHATSAPP LINKS [^] ************************* */

/* ************************** [v] SMOOTH SCROLL [v] ************************** */
function
	on_anchor_click(event)
{
	const	link = event.target.closest ? event.target.closest("a[href^='#']") : null;
	var		destination;
	var		href;

	if (!scroll || !link || event.defaultPrevented || event.button || event.ctrlKey || event.metaKey || event.shiftKey)
		return ;

	if (DOM.CLASS.CHECK(link, "skip_link")) // KEEP THE NATIVE JUMP, IT ALSO MOVES FOCUS
		return ;

	href = DOM.ATTRIBUTE.GET(link, "href");
	destination = href.length > 1 ? DOM.GET.ID(decodeURIComponent(href.slice(1))) : null;

	if (!destination)
		return ;

	event.preventDefault();
	scroll.scroll_to(destination, {offset: -header.offsetHeight}); // LAND BELOW THE STICKY HEADER

	if (window.history && window.history.pushState)
		window.history.pushState(null, "", href);
}

function
	start_smooth_scroll()
{
	if (typeof(smooth_scroll) === "undefined") // IE, OR THE SCRIPT DID NOT LOAD
		return ;

	scroll = smooth_scroll.start({targets: window, touch: false, anchors: false});
	body.addEventListener("click", on_anchor_click);
}
/* ************************** [^] SMOOTH SCROLL [^] ************************** */

/* ****************************** [v] TAGS [v] ****************************** */
function
	make_tag(element)
{
	const	tag =
	{
		element: element,
		holder: element.parentNode,
		angle: 0,
		speed: 0,
		live: true,
		x: 0,
		y: 0,
		width: 0,
		height: 0,
		frequency: tag_frequency
	};

	element.swing_tag = tag;

	if (DOM.CLASS.CHECK(element, "tag_large")) // HERO TAGS GO LIVE AFTER THEIR CSS DROP
	{
		tag.live = false;
		element.addEventListener(
			"animationend",
			function()
			{
				make_live(tag);
			}
		);
	}

	return (tag);
}

function
	make_live(tag)
{
	if (tag.live)
		return ;

	DOM.CLASS.ADD(tag.element, "tag_live");
	tag.live = true;
}

function
	measure_tag(tag)
{
	const	box = tag.holder.getBoundingClientRect();

	tag.width = tag.element.offsetWidth;
	tag.height = tag.element.offsetHeight;
	tag.x = box.left + (window.pageXOffset || 0) + box.width / 2; // THE PEG, IN PAGE COORDINATES
	tag.y = box.top + (window.pageYOffset || 0) + tag_peg;
	tag.frequency = tag_frequency * Math.sqrt(196 / Math.max(60, tag.height)); // A PENDULUM: SHORTER IS FASTER
}

function
	measure_tags()
{
	JS.ITERATE(tags, measure_tag);
}

function
	swing_frame(now)
{
	const	step = tags_time ? Math.min((now - tags_time) / 1000, 1 / 30) : 1 / 60;
	var		moving = false;

	tags_frame = 0;
	tags_time = now;

	JS.ITERATE(
		tags,
		function(tag)
		{
			if (!tag.live || (tag.angle === 0 && tag.speed === 0))
				return ;

			// GRAVITY PULLS IT BACK UNDER THE PEG, FRICTION AT THE PEG SLOWS IT DOWN
			tag.speed += (-tag.frequency * tag.frequency * Math.sin(tag.angle) - tag_damping * tag.speed) * step;
			tag.angle += tag.speed * step;

			if (Math.abs(tag.angle) < tag_rest && Math.abs(tag.speed) < tag_rest * 10)
			{
				tag.angle = 0;
				tag.speed = 0;
				tag.element.style.transform = "";
				return ;
			}

			tag.element.style.transform = "rotate(" + (tag.angle * 57.29578).toFixed(3) + "deg)";
			moving = true;
		}
	);

	if (moving)
		tags_frame = window.requestAnimationFrame(swing_frame);
	else
		tags_time = 0;
}

function
	wake_tags()
{
	if (tags_frame)
		return ;

	tags_time = 0;
	tags_frame = window.requestAnimationFrame(swing_frame);
}

/*
** AIR MOVED BY THE POINTER: (x, y) IS WHERE IT IS NOW (PAGE COORDINATES),
** (delta_x, delta_y) HOW FAR IT WENT, speed HOW FAST (PX/S). DRAG GROWS WITH
** SPEED, SO A SLOW PASS BARELY STIRS A TAG AND A FLICK SENDS IT SWINGING.
*/
function
	push_air(x, y, delta_x, delta_y, speed, strength)
{
	const	force = Math.min(speed / 1000, 2.5) * strength;
	var		pushed = false;

	if (force <= 0)
		return ;

	JS.ITERATE(
		tags,
		function(tag)
		{
			const	left = tag.x - tag.width / 2;
			const	top = tag.y - tag_peg;
			const	near_x = clamp(x, left, left + tag.width);
			const	near_y = clamp(y, top, top + tag.height);
			const	distance = Math.sqrt((x - near_x) * (x - near_x) + (y - near_y) * (y - near_y));
			var		falloff;
			var		lever_x;
			var		lever_y;

			if (!tag.live || distance >= tag_reach)
				return ;

			falloff = 1 - distance / tag_reach;
			falloff *= falloff;
			lever_x = near_x - tag.x;
			lever_y = clamp(near_y - tag.y, tag.height * 0.3, tag.height); // SIDEWAYS AIR CATCHES THE HANGING PART

			// TORQUE AROUND THE PEG (SCREEN Y GOES DOWN, SO + IS CLOCKWISE)
			tag.speed += tag_push * force * falloff * (lever_x * delta_y - lever_y * delta_x) / (tag.height * tag.height);
			tag.speed = clamp(tag.speed, -tag_max_speed, tag_max_speed);
			pushed = true;
		}
	);

	if (pushed)
		wake_tags();
}

function
	air_move(x, y, time, strength)
{
	const	gap = time - air_time;
	const	delta_x = x - air_x;
	const	delta_y = y - air_y;

	if (air_x !== null && gap > 0 && gap < 120) // A LONG PAUSE STARTS A NEW GUST
		push_air(x, y, delta_x, delta_y, Math.sqrt(delta_x * delta_x + delta_y * delta_y) / gap * 1000, strength);

	air_x = x;
	air_y = y;
	air_time = time;
}

function
	on_pointer_move(event)
{
	air_mouse = event.pointerType === "mouse";
	air_client_x = event.clientX;
	air_client_y = event.clientY;
	air_move(event.pageX, event.pageY, event.timeStamp, 1);
}

function
	air_from_scroll()
{
	// THE WALL MOVING UNDER A STILL MOUSE STIRS THE AIR TOO
	if (!tags.length || !air_mouse || air_x === null)
		return ;

	air_move(
		air_client_x + (window.pageXOffset || 0),
		air_client_y + (window.pageYOffset || 0),
		window.performance ? window.performance.now() : Date.now(),
		tag_scroll_push
	);
}

function
	on_tag_focus(event)
{
	const	tag = event.target.swing_tag;

	if (tag && tag.live && tag.angle === 0)
	{
		tag.speed = 1.4; // A NUDGE, SO KEYBOARD USERS SEE WHICH TAG THEY ARE ON
		wake_tags();
	}
}

function
	on_tag_poke(event)
{
	const	element = event.target.closest ? event.target.closest(".tag") : null;
	const	tag = element ? element.swing_tag : null;

	if (event.pointerType === "mouse" || !tag || !tag.live) // NO AIR FROM A FINGER, SO A TAP GIVES IT A FLICK
		return ;

	tag.speed = clamp(tag.speed + (event.pageX < tag.x ? 1.8 : -1.8), -tag_max_speed, tag_max_speed);
	wake_tags();
}

/*
** THE BRAND WALL HANGS ITSELF UP: WHEN A TAG SCROLLS INTO VIEW IT FALLS ONTO
** ITS PEG, A LITTLE TILTED, AND THE SAME PENDULUM SWINGS IT TO REST.
*/
function
	drop_tag(tag, delay)
{
	setTimeout(
		function()
		{
			DOM.CLASS.REMOVE(tag.holder, "wall_waiting");
			setTimeout(
				function()
				{
					measure_tag(tag); // IT WAS MEASURED WHILE STILL UP IN THE AIR
					tag.live = true;
					wake_tags();
				},
				tag_drop_time
			);
		},
		delay
	);
}

function
	prepare_wall()
{
	const	wall = DOM.GET.CLASS("brand_wall")[0];
	var		observer;

	if (!wall || !("IntersectionObserver" in window))
		return ;

	observer = new IntersectionObserver(
		function(entries)
		{
			const	wall_box = wall.getBoundingClientRect();

			JS.ITERATE(
				entries,
				function(entry)
				{
					const	tag = entry.target.firstElementChild.swing_tag;
					const	box = entry.boundingClientRect;

					if (!entry.isIntersecting)
						return ;

					observer.unobserve(entry.target);
					drop_tag(tag, Math.round((box.left - wall_box.left) / Math.max(1, wall_box.width) * 320)); // LEFT TO RIGHT ALONG THE ROW
				}
			);
		},
		{
			rootMargin: "0px 0px -10% 0px"
		}
	);

	JS.ITERATE(
		tags,
		function(tag)
		{
			if (!DOM.CLASS.CHECK(tag.holder, "wall_item"))
				return ;

			if (tag.holder.getBoundingClientRect().top < window.innerHeight) // ALREADY ON SCREEN, LEAVE IT HANGING
				return ;

			tag.live = false;
			tag.angle = (Math.random() * 2 - 1) * tag_drop_tilt;
			tag.element.style.transform = "rotate(" + (tag.angle * 57.29578).toFixed(3) + "deg)";
			DOM.CLASS.ADD(tag.holder, "wall_waiting");
			observer.observe(tag.holder);
		}
	);

	body.offsetHeight; // COMMIT THE WAITING STATE BEFORE THE DROP TRANSITION IS TURNED ON
	DOM.CLASS.ADD(wall, "wall_ready");
}

function
	prepare_tags()
{
	if (reduced_motion)
		return ;

	JS.ITERATE(
		to_array(DOM.GET.CLASS("tag")),
		function(element)
		{
			tags.push(make_tag(element));
		}
	);

	if (!tags.length)
		return ;

	measure_tags();
	prepare_wall();

	setTimeout( // IN CASE A HERO TAG NEVER REPORTS THE END OF ITS DROP
		function()
		{
			JS.ITERATE(
				tags,
				function(tag)
				{
					if (DOM.CLASS.CHECK(tag.element, "tag_large"))
						make_live(tag);
				}
			);
		},
		3000
	);

	window.addEventListener("pointermove", on_pointer_move, {passive: true});
	window.addEventListener("load", measure_tags);
	body.addEventListener("focusin", on_tag_focus);
	body.addEventListener("pointerdown", on_tag_poke, {passive: true});

	if ("ResizeObserver" in window) // ANY LAYOUT CHANGE (MENU, FONTS, IMAGES, WIDTH) MOVES THE PEGS
		(new ResizeObserver(measure_tags)).observe(body);
	else
		window.addEventListener("resize", measure_tags);
}
/* ****************************** [^] TAGS [^] ****************************** */

/* ************************** [v] SCROLL SCRUBS [v] ************************* */
/*
** TIED TO THE SCROLL POSITION, SO SCROLLING BACK UP PLAYS THEM BACKWARDS:
** - PRODUCT GROUPS CLOSE LIKE SOFT-CLOSE DRAWERS ON THEIR RUNNERS,
** - THE SCREWS OF THE "FIRMA KUNYESI" PLATE TURN TIGHT.
*/
function
	soft_close(progress)
{
	return (1 - Math.pow(1 - progress, 3)); // FAST, THEN THE DAMPER TAKES THE LAST BIT
}

function
	scrub()
{
	const	view_height = window.innerHeight;
	const	travel = Math.min(88, window.innerWidth * 0.14); // HOW FAR A DRAWER STANDS OPEN
	const	drawer_tops = [];
	var		plate_top = 0;

	scrub_frame = 0;

	JS.ITERATE( // READ EVERYTHING FIRST,
		drawers,
		function(drawer)
		{
			drawer_tops.push(drawer.getBoundingClientRect().top);
		}
	);

	if (plate)
		plate_top = plate.getBoundingClientRect().top;

	JS.ITERATE( // THEN WRITE
		drawers,
		function(drawer, index)
		{
			const	progress = soft_close(clamp((view_height - drawer_tops[index]) / (view_height * 0.4), 0, 1));

			drawer.style.transform = progress >= 1 ? "" : "translateX(" + ((1 - progress) * travel).toFixed(1) + "px)";
		}
	);

	JS.ITERATE(
		screws,
		function(screw, index)
		{
			const	progress = soft_close(clamp((view_height - plate_top) / (view_height * 0.55), 0, 1));

			screw.style.transform = "rotate(" + ((1 - progress) * -(300 + index * 40)).toFixed(1) + "deg)";
		}
	);
}

function
	scrub_soon()
{
	if (!scrub_frame && (drawers.length || screws.length))
		scrub_frame = window.requestAnimationFrame(scrub);
}

function
	prepare_scrubs()
{
	if (reduced_motion)
		return ;

	drawers = to_array(DOM.GET.CLASS("group_link"));
	screws = to_array(DOM.GET.CLASS("plate_screw"));
	scrub();
}
/* ************************** [^] SCROLL SCRUBS [^] ************************* */

function
	watch_sections()
{
	const	links = to_array(DOM.GET.CLASS("nav_link"));
	var		observer;

	if (!("IntersectionObserver" in window))
		return ;

	observer = new IntersectionObserver(
		function(entries)
		{
			JS.ITERATE(
				entries,
				function(entry)
				{
					const	hash = "#" + entry.target.id;

					if (!entry.isIntersecting)
						return ;

					JS.ITERATE(
						links,
						function(link)
						{
							if (DOM.ATTRIBUTE.GET(link, "href") === hash)
								DOM.CLASS.ADD(link, "active");
							else
								DOM.CLASS.REMOVE(link, "active");
						}
					);
				}
			);
		},
		{
			rootMargin: "-45% 0px -50% 0px"
		}
	);

	JS.ITERATE(
		["anasayfa", "markalar", "urun-gruplari", "hakkimizda", "iletisim"],
		function(id)
		{
			const	section = DOM.GET.ID(id);

			if (section)
				observer.observe(section);
		}
	);
}

async function
	print_console()
{
	try {if (window.self !== window.top) return ;} // INSIDE AN IFRAME
	catch (ERROR) {return ;}

	if (window.innerWidth < mobile_width) // PHONES NEVER OPEN THE CONSOLE
		return ;

	try
	{
		console.log("%c ",
			"background-image: url(data:image/svg+xml;base64," +
			 btoa(await AJAX.GET("favicons/console_header.svg")) +
			");" +
			"padding-bottom: 200px;" +
			"padding-left: 500px;" +
			"width: 100%;" +
			"margin: 20px;" +
			"background-size: contain;" +
			"background-position: center center;" +
			"background-repeat: no-repeat;"
		);
	}
	catch (ERROR) {return ;}
}

function
	main()
{
	print_console();
	update_whatsapp_links();
	update_brand_links();
	update_group_links();
	update_form_link();
	watch_sections();
	prepare_tags();
	prepare_scrubs();
	window.addEventListener("scroll", on_scroll, {passive: true});
	window.addEventListener("resize", on_resize);
	document.addEventListener("keydown", on_key);
	year_date.textContent = new Date().getFullYear().toString();
	on_scroll();
	start_smooth_scroll(); // LAST, SO THE PAGE'S OWN KEYS WIN
}

DOM.START(main);
