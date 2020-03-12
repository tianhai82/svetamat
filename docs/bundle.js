
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if (typeof $$scope.dirty === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function stop_propagation(fn) {
        return function (event) {
            event.stopPropagation();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        if (value != null || input.value) {
            input.value = value;
        }
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function add_resize_listener(element, fn) {
        if (getComputedStyle(element).position === 'static') {
            element.style.position = 'relative';
        }
        const object = document.createElement('object');
        object.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; height: 100%; width: 100%; overflow: hidden; pointer-events: none; z-index: -1;');
        object.setAttribute('aria-hidden', 'true');
        object.type = 'text/html';
        object.tabIndex = -1;
        let win;
        object.onload = () => {
            win = object.contentDocument.defaultView;
            win.addEventListener('resize', fn);
        };
        if (/Trident/.test(navigator.userAgent)) {
            element.appendChild(object);
            object.data = 'about:blank';
        }
        else {
            object.data = 'about:blank';
            element.appendChild(object);
        }
        return {
            cancel: () => {
                win && win.removeEventListener && win.removeEventListener('resize', fn);
                element.removeChild(object);
            }
        };
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let stylesheet;
    let active = 0;
    let current_rules = {};
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        if (!current_rules[name]) {
            if (!stylesheet) {
                const style = element('style');
                document.head.appendChild(style);
                stylesheet = style.sheet;
            }
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        node.style.animation = (node.style.animation || '')
            .split(', ')
            .filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        )
            .join(', ');
        if (name && !--active)
            clear_rules();
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            let i = stylesheet.cssRules.length;
            while (i--)
                stylesheet.deleteRule(i);
            current_rules = {};
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    const seen_callbacks = new Set();
    function flush() {
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined' ? window : global);

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.18.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /* src\Tailwindcss.svelte generated by Svelte v3.18.1 */

    function create_fragment(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class Tailwindcss extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tailwindcss",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src\widgets\Button.svelte generated by Svelte v3.18.1 */

    const file = "src\\widgets\\Button.svelte";

    function create_fragment$1(ctx) {
    	let button;
    	let current;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], null);

    	const block_1 = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button, "class", /*cls*/ ctx[0]);
    			add_location(button, file, 52, 0, 1206);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			current = true;
    			dispose = listen_dev(button, "click", /*click_handler*/ ctx[16], false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 16384) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[14], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, null));
    			}

    			if (!current || dirty & /*cls*/ 1) {
    				attr_dev(button, "class", /*cls*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block: block_1,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block_1;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { text = false } = $$props;
    	let { fab = false } = $$props;
    	let { outlined = false } = $$props;
    	let { rounded = false } = $$props;
    	let { tile = false } = $$props;
    	let { block = false } = $$props;
    	let { xs = false } = $$props;
    	let { sm = false } = $$props;
    	let { lg = false } = $$props;
    	let { xl = false } = $$props;
    	let { textColor = "text-black" } = $$props;
    	let { outlineColor = "border-black" } = $$props;
    	let { bgColor = "bg-transparent" } = $$props;
    	let cls = "focus:outline-none uppercase tracking-wide ripple";

    	if (outlined) {
    		cls += ` border border-solid ${textColor} ${outlineColor} ${bgColor} hover:elevation-1 active:elevation-0`;
    	} else if (text) {
    		cls += ` ${textColor} ${bgColor} hover:elevation-1 active:elevation-0`;
    	} else {
    		cls += ` elevation-2 hover:elevation-4 active:elevation-0 ${textColor} ${bgColor}`;
    	}

    	if (rounded) {
    		cls += " rounded-full";
    	}

    	if (fab) {
    		cls += " rounded-full flex items-center justify-center";
    	}

    	if (!tile) {
    		cls += " rounded";
    	}

    	if (block) {
    		cls += " block w-full";
    	}

    	if (xs) {
    		cls += " h-5 text-xs px-2";
    	} else if (sm) {
    		cls += " h-6 text-sm px-3";
    	} else if (lg) {
    		cls += " h-10 text-lg px-5";
    	} else if (xl) {
    		cls += " h-12 text-xl px-6";
    	} else {
    		cls += " h-8 text-base px-4";
    	}

    	cls = cls.trim();

    	const writable_props = [
    		"text",
    		"fab",
    		"outlined",
    		"rounded",
    		"tile",
    		"block",
    		"xs",
    		"sm",
    		"lg",
    		"xl",
    		"textColor",
    		"outlineColor",
    		"bgColor"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Button> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("text" in $$props) $$invalidate(1, text = $$props.text);
    		if ("fab" in $$props) $$invalidate(2, fab = $$props.fab);
    		if ("outlined" in $$props) $$invalidate(3, outlined = $$props.outlined);
    		if ("rounded" in $$props) $$invalidate(4, rounded = $$props.rounded);
    		if ("tile" in $$props) $$invalidate(5, tile = $$props.tile);
    		if ("block" in $$props) $$invalidate(6, block = $$props.block);
    		if ("xs" in $$props) $$invalidate(7, xs = $$props.xs);
    		if ("sm" in $$props) $$invalidate(8, sm = $$props.sm);
    		if ("lg" in $$props) $$invalidate(9, lg = $$props.lg);
    		if ("xl" in $$props) $$invalidate(10, xl = $$props.xl);
    		if ("textColor" in $$props) $$invalidate(11, textColor = $$props.textColor);
    		if ("outlineColor" in $$props) $$invalidate(12, outlineColor = $$props.outlineColor);
    		if ("bgColor" in $$props) $$invalidate(13, bgColor = $$props.bgColor);
    		if ("$$scope" in $$props) $$invalidate(14, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return {
    			text,
    			fab,
    			outlined,
    			rounded,
    			tile,
    			block,
    			xs,
    			sm,
    			lg,
    			xl,
    			textColor,
    			outlineColor,
    			bgColor,
    			cls
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("text" in $$props) $$invalidate(1, text = $$props.text);
    		if ("fab" in $$props) $$invalidate(2, fab = $$props.fab);
    		if ("outlined" in $$props) $$invalidate(3, outlined = $$props.outlined);
    		if ("rounded" in $$props) $$invalidate(4, rounded = $$props.rounded);
    		if ("tile" in $$props) $$invalidate(5, tile = $$props.tile);
    		if ("block" in $$props) $$invalidate(6, block = $$props.block);
    		if ("xs" in $$props) $$invalidate(7, xs = $$props.xs);
    		if ("sm" in $$props) $$invalidate(8, sm = $$props.sm);
    		if ("lg" in $$props) $$invalidate(9, lg = $$props.lg);
    		if ("xl" in $$props) $$invalidate(10, xl = $$props.xl);
    		if ("textColor" in $$props) $$invalidate(11, textColor = $$props.textColor);
    		if ("outlineColor" in $$props) $$invalidate(12, outlineColor = $$props.outlineColor);
    		if ("bgColor" in $$props) $$invalidate(13, bgColor = $$props.bgColor);
    		if ("cls" in $$props) $$invalidate(0, cls = $$props.cls);
    	};

    	return [
    		cls,
    		text,
    		fab,
    		outlined,
    		rounded,
    		tile,
    		block,
    		xs,
    		sm,
    		lg,
    		xl,
    		textColor,
    		outlineColor,
    		bgColor,
    		$$scope,
    		$$slots,
    		click_handler
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance, create_fragment$1, safe_not_equal, {
    			text: 1,
    			fab: 2,
    			outlined: 3,
    			rounded: 4,
    			tile: 5,
    			block: 6,
    			xs: 7,
    			sm: 8,
    			lg: 9,
    			xl: 10,
    			textColor: 11,
    			outlineColor: 12,
    			bgColor: 13
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get text() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fab() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fab(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outlined() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outlined(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rounded() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rounded(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get tile() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set tile(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get block() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set block(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xs() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xs(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sm() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sm(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lg() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lg(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get xl() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set xl(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get textColor() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set textColor(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outlineColor() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outlineColor(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get bgColor() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set bgColor(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* src\widgets\InputStd.svelte generated by Svelte v3.18.1 */
    const file$1 = "src\\widgets\\InputStd.svelte";

    function create_fragment$2(ctx) {
    	let div0;
    	let label_1;
    	let t0;
    	let t1;
    	let input;
    	let t2;
    	let i;
    	let t3;
    	let div0_class_value;
    	let t4;
    	let div1;
    	let t5;
    	let dispose;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			label_1 = element("label");
    			t0 = text(/*label*/ ctx[1]);
    			t1 = space();
    			input = element("input");
    			t2 = space();
    			i = element("i");
    			t3 = text(/*icon*/ ctx[4]);
    			t4 = space();
    			div1 = element("div");
    			t5 = text(/*helperText*/ ctx[3]);
    			attr_dev(label_1, "style", /*labelTopPadding*/ ctx[9]);
    			attr_dev(label_1, "class", /*labelCls*/ ctx[7]);
    			add_location(label_1, file$1, 56, 2, 1488);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "style", /*inputPadBottom*/ ctx[8]);
    			attr_dev(input, "class", "pt-6 appearance-none bg-transparent border-none w-full\n         text-gray-800 px-2 focus:outline-none");
    			add_location(input, file$1, 61, 2, 1570);
    			attr_dev(i, "class", /*iconCls*/ ctx[6]);
    			add_location(i, file$1, 72, 2, 1931);

    			attr_dev(div0, "class", div0_class_value = /*hasFocus*/ ctx[5]
    			? `relative rounded-t border-b-2 bg-gray-300 ${/*borderColor*/ ctx[2]}`
    			: `relative rounded-t border-b border-gray-500 hover:border-gray-900 hover:bg-gray-100`);

    			add_location(div0, file$1, 52, 0, 1308);
    			attr_dev(div1, "class", /*helperTextCls*/ ctx[10]);
    			add_location(div1, file$1, 74, 0, 1970);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, label_1);
    			append_dev(label_1, t0);
    			append_dev(div0, t1);
    			append_dev(div0, input);
    			set_input_value(input, /*value*/ ctx[0]);
    			append_dev(div0, t2);
    			append_dev(div0, i);
    			append_dev(i, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, t5);

    			dispose = [
    				listen_dev(input, "input", /*input_input_handler*/ ctx[21]),
    				listen_dev(input, "input", /*input_handler*/ ctx[17], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_1*/ ctx[22], false, false, false),
    				listen_dev(input, "blur", /*blur_handler_1*/ ctx[23], false, false, false),
    				listen_dev(input, "focus", /*focus_handler*/ ctx[18], false, false, false),
    				listen_dev(input, "blur", /*blur_handler*/ ctx[19], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler*/ ctx[20], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*label*/ 2) set_data_dev(t0, /*label*/ ctx[1]);

    			if (dirty & /*labelTopPadding*/ 512) {
    				attr_dev(label_1, "style", /*labelTopPadding*/ ctx[9]);
    			}

    			if (dirty & /*labelCls*/ 128) {
    				attr_dev(label_1, "class", /*labelCls*/ ctx[7]);
    			}

    			if (dirty & /*inputPadBottom*/ 256) {
    				attr_dev(input, "style", /*inputPadBottom*/ ctx[8]);
    			}

    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			if (dirty & /*icon*/ 16) set_data_dev(t3, /*icon*/ ctx[4]);

    			if (dirty & /*iconCls*/ 64) {
    				attr_dev(i, "class", /*iconCls*/ ctx[6]);
    			}

    			if (dirty & /*hasFocus, borderColor*/ 36 && div0_class_value !== (div0_class_value = /*hasFocus*/ ctx[5]
    			? `relative rounded-t border-b-2 bg-gray-300 ${/*borderColor*/ ctx[2]}`
    			: `relative rounded-t border-b border-gray-500 hover:border-gray-900 hover:bg-gray-100`)) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*helperText*/ 8) set_data_dev(t5, /*helperText*/ ctx[3]);

    			if (dirty & /*helperTextCls*/ 1024) {
    				attr_dev(div1, "class", /*helperTextCls*/ ctx[10]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(div1);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $y;
    	let { label = "" } = $$props;
    	let { value = "" } = $$props;
    	let { borderColor = "border-blue-700" } = $$props;
    	let { labelColor = "text-blue-700" } = $$props;
    	let { helperText = "" } = $$props;
    	let { helperTextColor = "" } = $$props;
    	let { icon = "" } = $$props;
    	let hasFocus = false;
    	let iconCls = "";

    	onMount(() => {
    		$$invalidate(6, iconCls = icon
    		? "absolute right-0 top-0 mt-5 mr-2 material-icons md-18 pointer-events-none"
    		: "hidden");
    	});

    	const y = tweened(1, { duration: 50 });
    	validate_store(y, "y");
    	component_subscribe($$self, y, value => $$invalidate(15, $y = value));
    	let labelCls = "absolute left-0 px-2 text-sm text-gray-600 pointer-events-none";
    	let inputPadBottom = "";

    	function setLabelColor(prefix) {
    		$$invalidate(7, labelCls = `${prefix} ${labelColor}`);
    	}

    	let valueEmpty = false;

    	const writable_props = [
    		"label",
    		"value",
    		"borderColor",
    		"labelColor",
    		"helperText",
    		"helperTextColor",
    		"icon"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<InputStd> was created with unknown prop '${key}'`);
    	});

    	function input_handler(event) {
    		bubble($$self, event);
    	}

    	function focus_handler(event) {
    		bubble($$self, event);
    	}

    	function blur_handler(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	const focus_handler_1 = () => $$invalidate(5, hasFocus = true);
    	const blur_handler_1 = () => $$invalidate(5, hasFocus = false);

    	$$self.$set = $$props => {
    		if ("label" in $$props) $$invalidate(1, label = $$props.label);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("borderColor" in $$props) $$invalidate(2, borderColor = $$props.borderColor);
    		if ("labelColor" in $$props) $$invalidate(12, labelColor = $$props.labelColor);
    		if ("helperText" in $$props) $$invalidate(3, helperText = $$props.helperText);
    		if ("helperTextColor" in $$props) $$invalidate(13, helperTextColor = $$props.helperTextColor);
    		if ("icon" in $$props) $$invalidate(4, icon = $$props.icon);
    	};

    	$$self.$capture_state = () => {
    		return {
    			label,
    			value,
    			borderColor,
    			labelColor,
    			helperText,
    			helperTextColor,
    			icon,
    			hasFocus,
    			iconCls,
    			labelCls,
    			inputPadBottom,
    			valueEmpty,
    			labelTopPadding,
    			$y,
    			helperTextCls
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("label" in $$props) $$invalidate(1, label = $$props.label);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("borderColor" in $$props) $$invalidate(2, borderColor = $$props.borderColor);
    		if ("labelColor" in $$props) $$invalidate(12, labelColor = $$props.labelColor);
    		if ("helperText" in $$props) $$invalidate(3, helperText = $$props.helperText);
    		if ("helperTextColor" in $$props) $$invalidate(13, helperTextColor = $$props.helperTextColor);
    		if ("icon" in $$props) $$invalidate(4, icon = $$props.icon);
    		if ("hasFocus" in $$props) $$invalidate(5, hasFocus = $$props.hasFocus);
    		if ("iconCls" in $$props) $$invalidate(6, iconCls = $$props.iconCls);
    		if ("labelCls" in $$props) $$invalidate(7, labelCls = $$props.labelCls);
    		if ("inputPadBottom" in $$props) $$invalidate(8, inputPadBottom = $$props.inputPadBottom);
    		if ("valueEmpty" in $$props) $$invalidate(14, valueEmpty = $$props.valueEmpty);
    		if ("labelTopPadding" in $$props) $$invalidate(9, labelTopPadding = $$props.labelTopPadding);
    		if ("$y" in $$props) y.set($y = $$props.$y);
    		if ("helperTextCls" in $$props) $$invalidate(10, helperTextCls = $$props.helperTextCls);
    	};

    	let labelTopPadding;
    	let helperTextCls;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$y*/ 32768) {
    			 $$invalidate(9, labelTopPadding = `padding-top:${$y}rem;`);
    		}

    		if ($$self.$$.dirty & /*helperTextColor*/ 8192) {
    			 $$invalidate(10, helperTextCls = `text-sm px-2 font-light h-5 ${helperTextColor}`);
    		}

    		if ($$self.$$.dirty & /*value*/ 1) {
    			 $$invalidate(14, valueEmpty = !value || value.length === 0);
    		}

    		if ($$self.$$.dirty & /*hasFocus, valueEmpty*/ 16416) {
    			 if (hasFocus) {
    				y.set(0.25);
    				setLabelColor("absolute left-0 px-2 text-sm pointer-events-none");
    				$$invalidate(8, inputPadBottom = "padding-bottom:7px");
    			} else {
    				$$invalidate(8, inputPadBottom = "padding-bottom:8px");
    				$$invalidate(7, labelCls = "absolute left-0 px-2 text-sm pointer-events-none text-gray-600");

    				if (valueEmpty) {
    					y.set(1);
    					$$invalidate(7, labelCls = "absolute left-0 px-2 pointer-events-none text-gray-600");
    				} else {
    					y.set(0.25);
    				}
    			}
    		}
    	};

    	return [
    		value,
    		label,
    		borderColor,
    		helperText,
    		icon,
    		hasFocus,
    		iconCls,
    		labelCls,
    		inputPadBottom,
    		labelTopPadding,
    		helperTextCls,
    		y,
    		labelColor,
    		helperTextColor,
    		valueEmpty,
    		$y,
    		setLabelColor,
    		input_handler,
    		focus_handler,
    		blur_handler,
    		keydown_handler,
    		input_input_handler,
    		focus_handler_1,
    		blur_handler_1
    	];
    }

    class InputStd extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$2, safe_not_equal, {
    			label: 1,
    			value: 0,
    			borderColor: 2,
    			labelColor: 12,
    			helperText: 3,
    			helperTextColor: 13,
    			icon: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputStd",
    			options,
    			id: create_fragment$2.name
    		});
    	}

    	get label() {
    		throw new Error("<InputStd>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<InputStd>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<InputStd>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<InputStd>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get borderColor() {
    		throw new Error("<InputStd>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set borderColor(value) {
    		throw new Error("<InputStd>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelColor() {
    		throw new Error("<InputStd>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelColor(value) {
    		throw new Error("<InputStd>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helperText() {
    		throw new Error("<InputStd>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helperText(value) {
    		throw new Error("<InputStd>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helperTextColor() {
    		throw new Error("<InputStd>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helperTextColor(value) {
    		throw new Error("<InputStd>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<InputStd>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<InputStd>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\widgets\InputOutlined.svelte generated by Svelte v3.18.1 */
    const file$2 = "src\\widgets\\InputOutlined.svelte";

    function create_fragment$3(ctx) {
    	let fieldset;
    	let legend;
    	let t0;
    	let t1;
    	let label_1;
    	let t2;
    	let t3;
    	let input;
    	let t4;
    	let i;
    	let t5;
    	let t6;
    	let div;
    	let t7;
    	let dispose;

    	const block = {
    		c: function create() {
    			fieldset = element("fieldset");
    			legend = element("legend");
    			t0 = text("​");
    			t1 = space();
    			label_1 = element("label");
    			t2 = text(/*label*/ ctx[1]);
    			t3 = space();
    			input = element("input");
    			t4 = space();
    			i = element("i");
    			t5 = text(/*icon*/ ctx[3]);
    			t6 = space();
    			div = element("div");
    			t7 = text(/*helperText*/ ctx[2]);
    			attr_dev(legend, "class", "text-sm");
    			attr_dev(legend, "style", /*legendStyle*/ ctx[10]);
    			add_location(legend, file$2, 67, 2, 1883);
    			attr_dev(label_1, "style", /*labelTopPadding*/ ctx[11]);
    			attr_dev(label_1, "class", /*labelCls*/ ctx[7]);
    			add_location(label_1, file$2, 68, 2, 1947);
    			attr_dev(input, "type", "text");
    			attr_dev(input, "style", /*inputPadBottom*/ ctx[8]);
    			attr_dev(input, "class", "h-8 appearance-none bg-transparent border-none w-full\n         text-gray-800 px-2 focus:outline-none");
    			add_location(input, file$2, 74, 2, 2058);
    			attr_dev(i, "class", /*iconCls*/ ctx[5]);
    			add_location(i, file$2, 85, 2, 2418);
    			attr_dev(fieldset, "class", /*fieldsetCls*/ ctx[6]);
    			add_location(fieldset, file$2, 65, 0, 1846);
    			attr_dev(div, "class", /*helperTextCls*/ ctx[12]);
    			add_location(div, file$2, 87, 0, 2462);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, fieldset, anchor);
    			append_dev(fieldset, legend);
    			append_dev(legend, t0);
    			append_dev(fieldset, t1);
    			append_dev(fieldset, label_1);
    			append_dev(label_1, t2);
    			/*label_1_binding*/ ctx[26](label_1);
    			append_dev(fieldset, t3);
    			append_dev(fieldset, input);
    			set_input_value(input, /*value*/ ctx[0]);
    			append_dev(fieldset, t4);
    			append_dev(fieldset, i);
    			append_dev(i, t5);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, t7);

    			dispose = [
    				listen_dev(input, "input", /*input_input_handler*/ ctx[27]),
    				listen_dev(input, "input", /*input_handler*/ ctx[22], false, false, false),
    				listen_dev(input, "focus", /*focus_handler_1*/ ctx[28], false, false, false),
    				listen_dev(input, "blur", /*blur_handler_1*/ ctx[29], false, false, false),
    				listen_dev(input, "focus", /*focus_handler*/ ctx[23], false, false, false),
    				listen_dev(input, "blur", /*blur_handler*/ ctx[24], false, false, false),
    				listen_dev(input, "keydown", /*keydown_handler*/ ctx[25], false, false, false)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*legendStyle*/ 1024) {
    				attr_dev(legend, "style", /*legendStyle*/ ctx[10]);
    			}

    			if (dirty & /*label*/ 2) set_data_dev(t2, /*label*/ ctx[1]);

    			if (dirty & /*labelTopPadding*/ 2048) {
    				attr_dev(label_1, "style", /*labelTopPadding*/ ctx[11]);
    			}

    			if (dirty & /*labelCls*/ 128) {
    				attr_dev(label_1, "class", /*labelCls*/ ctx[7]);
    			}

    			if (dirty & /*inputPadBottom*/ 256) {
    				attr_dev(input, "style", /*inputPadBottom*/ ctx[8]);
    			}

    			if (dirty & /*value*/ 1 && input.value !== /*value*/ ctx[0]) {
    				set_input_value(input, /*value*/ ctx[0]);
    			}

    			if (dirty & /*icon*/ 8) set_data_dev(t5, /*icon*/ ctx[3]);

    			if (dirty & /*iconCls*/ 32) {
    				attr_dev(i, "class", /*iconCls*/ ctx[5]);
    			}

    			if (dirty & /*fieldsetCls*/ 64) {
    				attr_dev(fieldset, "class", /*fieldsetCls*/ ctx[6]);
    			}

    			if (dirty & /*helperText*/ 4) set_data_dev(t7, /*helperText*/ ctx[2]);

    			if (dirty & /*helperTextCls*/ 4096) {
    				attr_dev(div, "class", /*helperTextCls*/ ctx[12]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(fieldset);
    			/*label_1_binding*/ ctx[26](null);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $y;
    	let { label = "" } = $$props;
    	let { value = "" } = $$props;
    	let { borderColor = "border-blue-700" } = $$props;
    	let { labelColor = "text-blue-700" } = $$props;
    	let { helperText = "" } = $$props;
    	let { helperTextColor = "" } = $$props;
    	let { icon = "" } = $$props;
    	let hasFocus = false;
    	let iconCls = "";
    	const y = tweened(0.75, { duration: 50 });
    	validate_store(y, "y");
    	component_subscribe($$self, y, value => $$invalidate(19, $y = value));
    	let fieldsetCls = "relative rounded border border-gray-500";
    	let labelCls = "absolute left-0 px-2 text-gray-600 pointer-events-none";
    	let inputPadBottom = "padding-bottom:8px";
    	let labelElement;
    	let legendStyle = "";
    	let labelWidth;

    	onMount(() => {
    		$$invalidate(17, labelWidth = labelElement.offsetWidth * 7 / 8 + 5);

    		$$invalidate(5, iconCls = icon
    		? "absolute right-0 bottom-0 pb-3 pr-2 material-icons md-18 pointer-events-none"
    		: "hidden");
    	});

    	function setFieldSetColor(prefix) {
    		$$invalidate(6, fieldsetCls = `${prefix} ${borderColor}`);
    	}

    	function setLabelColor(prefix) {
    		$$invalidate(7, labelCls = `${prefix} ${labelColor}`);
    	}

    	let valueEmpty = false;

    	const writable_props = [
    		"label",
    		"value",
    		"borderColor",
    		"labelColor",
    		"helperText",
    		"helperTextColor",
    		"icon"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<InputOutlined> was created with unknown prop '${key}'`);
    	});

    	function input_handler(event) {
    		bubble($$self, event);
    	}

    	function focus_handler(event) {
    		bubble($$self, event);
    	}

    	function blur_handler(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	function label_1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(9, labelElement = $$value);
    		});
    	}

    	function input_input_handler() {
    		value = this.value;
    		$$invalidate(0, value);
    	}

    	const focus_handler_1 = () => $$invalidate(4, hasFocus = true);
    	const blur_handler_1 = () => $$invalidate(4, hasFocus = false);

    	$$self.$set = $$props => {
    		if ("label" in $$props) $$invalidate(1, label = $$props.label);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("borderColor" in $$props) $$invalidate(14, borderColor = $$props.borderColor);
    		if ("labelColor" in $$props) $$invalidate(15, labelColor = $$props.labelColor);
    		if ("helperText" in $$props) $$invalidate(2, helperText = $$props.helperText);
    		if ("helperTextColor" in $$props) $$invalidate(16, helperTextColor = $$props.helperTextColor);
    		if ("icon" in $$props) $$invalidate(3, icon = $$props.icon);
    	};

    	$$self.$capture_state = () => {
    		return {
    			label,
    			value,
    			borderColor,
    			labelColor,
    			helperText,
    			helperTextColor,
    			icon,
    			hasFocus,
    			iconCls,
    			fieldsetCls,
    			labelCls,
    			inputPadBottom,
    			labelElement,
    			legendStyle,
    			labelWidth,
    			valueEmpty,
    			labelTopPadding,
    			$y,
    			helperTextCls
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("label" in $$props) $$invalidate(1, label = $$props.label);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("borderColor" in $$props) $$invalidate(14, borderColor = $$props.borderColor);
    		if ("labelColor" in $$props) $$invalidate(15, labelColor = $$props.labelColor);
    		if ("helperText" in $$props) $$invalidate(2, helperText = $$props.helperText);
    		if ("helperTextColor" in $$props) $$invalidate(16, helperTextColor = $$props.helperTextColor);
    		if ("icon" in $$props) $$invalidate(3, icon = $$props.icon);
    		if ("hasFocus" in $$props) $$invalidate(4, hasFocus = $$props.hasFocus);
    		if ("iconCls" in $$props) $$invalidate(5, iconCls = $$props.iconCls);
    		if ("fieldsetCls" in $$props) $$invalidate(6, fieldsetCls = $$props.fieldsetCls);
    		if ("labelCls" in $$props) $$invalidate(7, labelCls = $$props.labelCls);
    		if ("inputPadBottom" in $$props) $$invalidate(8, inputPadBottom = $$props.inputPadBottom);
    		if ("labelElement" in $$props) $$invalidate(9, labelElement = $$props.labelElement);
    		if ("legendStyle" in $$props) $$invalidate(10, legendStyle = $$props.legendStyle);
    		if ("labelWidth" in $$props) $$invalidate(17, labelWidth = $$props.labelWidth);
    		if ("valueEmpty" in $$props) $$invalidate(18, valueEmpty = $$props.valueEmpty);
    		if ("labelTopPadding" in $$props) $$invalidate(11, labelTopPadding = $$props.labelTopPadding);
    		if ("$y" in $$props) y.set($y = $$props.$y);
    		if ("helperTextCls" in $$props) $$invalidate(12, helperTextCls = $$props.helperTextCls);
    	};

    	let labelTopPadding;
    	let helperTextCls;

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$y*/ 524288) {
    			 $$invalidate(11, labelTopPadding = `margin-top:${$y}rem;`);
    		}

    		if ($$self.$$.dirty & /*helperTextColor*/ 65536) {
    			 $$invalidate(12, helperTextCls = `text-sm px-2 font-light h-5 ${helperTextColor}`);
    		}

    		if ($$self.$$.dirty & /*value*/ 1) {
    			 $$invalidate(18, valueEmpty = !value || value.length === 0);
    		}

    		if ($$self.$$.dirty & /*hasFocus, labelWidth, valueEmpty*/ 393232) {
    			 if (hasFocus) {
    				setLabelColor("absolute left-0 px-2 text-sm pointer-events-none");
    				setFieldSetColor("relative rounded border-2");
    				y.set(-1.2);
    				$$invalidate(10, legendStyle = `width:${labelWidth}px;margin-left:6px;`);
    				$$invalidate(8, inputPadBottom = "margin-bottom:4px");
    			} else {
    				$$invalidate(6, fieldsetCls = "relative rounded border border-gray-500 hover:border-gray-900");
    				$$invalidate(8, inputPadBottom = "margin-bottom:5px;");

    				if (valueEmpty) {
    					$$invalidate(10, legendStyle = "");
    					$$invalidate(7, labelCls = "absolute left-0 ml-2 pointer-events-none text-gray-600");
    					y.set(0);
    				} else {
    					$$invalidate(7, labelCls = "absolute left-0 px-2 text-sm pointer-events-none text-gray-600");
    					$$invalidate(10, legendStyle = `width:${labelWidth}px;margin-left:6px;`);
    					y.set(-1.2);
    				}
    			}
    		}
    	};

    	return [
    		value,
    		label,
    		helperText,
    		icon,
    		hasFocus,
    		iconCls,
    		fieldsetCls,
    		labelCls,
    		inputPadBottom,
    		labelElement,
    		legendStyle,
    		labelTopPadding,
    		helperTextCls,
    		y,
    		borderColor,
    		labelColor,
    		helperTextColor,
    		labelWidth,
    		valueEmpty,
    		$y,
    		setFieldSetColor,
    		setLabelColor,
    		input_handler,
    		focus_handler,
    		blur_handler,
    		keydown_handler,
    		label_1_binding,
    		input_input_handler,
    		focus_handler_1,
    		blur_handler_1
    	];
    }

    class InputOutlined extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$3, safe_not_equal, {
    			label: 1,
    			value: 0,
    			borderColor: 14,
    			labelColor: 15,
    			helperText: 2,
    			helperTextColor: 16,
    			icon: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InputOutlined",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get label() {
    		throw new Error("<InputOutlined>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<InputOutlined>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<InputOutlined>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<InputOutlined>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get borderColor() {
    		throw new Error("<InputOutlined>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set borderColor(value) {
    		throw new Error("<InputOutlined>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelColor() {
    		throw new Error("<InputOutlined>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelColor(value) {
    		throw new Error("<InputOutlined>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helperText() {
    		throw new Error("<InputOutlined>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helperText(value) {
    		throw new Error("<InputOutlined>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helperTextColor() {
    		throw new Error("<InputOutlined>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helperTextColor(value) {
    		throw new Error("<InputOutlined>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<InputOutlined>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<InputOutlined>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\widgets\Input.svelte generated by Svelte v3.18.1 */

    // (37:0) {:else}
    function create_else_block(ctx) {
    	let updating_value;
    	let current;

    	function inputoutlined_value_binding(value_1) {
    		/*inputoutlined_value_binding*/ ctx[17].call(null, value_1);
    	}

    	let inputoutlined_props = {
    		label: /*label*/ ctx[1],
    		borderColor: /*borderColor*/ ctx[2],
    		labelColor: /*labelColor*/ ctx[3],
    		helperText: /*helperText*/ ctx[4],
    		icon: /*icon*/ ctx[7],
    		helperTextColor: /*helperTextColor*/ ctx[5]
    	};

    	if (/*value*/ ctx[0] !== void 0) {
    		inputoutlined_props.value = /*value*/ ctx[0];
    	}

    	const inputoutlined = new InputOutlined({
    			props: inputoutlined_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(inputoutlined, "value", inputoutlined_value_binding));
    	inputoutlined.$on("focus", /*focus_handler_1*/ ctx[18]);
    	inputoutlined.$on("blur", /*blur_handler_1*/ ctx[19]);
    	inputoutlined.$on("keydown", /*keydown_handler_1*/ ctx[20]);
    	inputoutlined.$on("input", /*input_handler_1*/ ctx[21]);

    	const block = {
    		c: function create() {
    			create_component(inputoutlined.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(inputoutlined, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const inputoutlined_changes = {};
    			if (dirty & /*label*/ 2) inputoutlined_changes.label = /*label*/ ctx[1];
    			if (dirty & /*borderColor*/ 4) inputoutlined_changes.borderColor = /*borderColor*/ ctx[2];
    			if (dirty & /*labelColor*/ 8) inputoutlined_changes.labelColor = /*labelColor*/ ctx[3];
    			if (dirty & /*helperText*/ 16) inputoutlined_changes.helperText = /*helperText*/ ctx[4];
    			if (dirty & /*icon*/ 128) inputoutlined_changes.icon = /*icon*/ ctx[7];
    			if (dirty & /*helperTextColor*/ 32) inputoutlined_changes.helperTextColor = /*helperTextColor*/ ctx[5];

    			if (!updating_value && dirty & /*value*/ 1) {
    				updating_value = true;
    				inputoutlined_changes.value = /*value*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			inputoutlined.$set(inputoutlined_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputoutlined.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputoutlined.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(inputoutlined, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(37:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (31:0) {#if !outlined}
    function create_if_block(ctx) {
    	let updating_value;
    	let current;

    	function inputstd_value_binding(value_1) {
    		/*inputstd_value_binding*/ ctx[12].call(null, value_1);
    	}

    	let inputstd_props = {
    		label: /*label*/ ctx[1],
    		borderColor: /*borderColor*/ ctx[2],
    		labelColor: /*labelColor*/ ctx[3],
    		helperText: /*helperText*/ ctx[4],
    		icon: /*icon*/ ctx[7],
    		helperTextColor: /*helperTextColor*/ ctx[5]
    	};

    	if (/*value*/ ctx[0] !== void 0) {
    		inputstd_props.value = /*value*/ ctx[0];
    	}

    	const inputstd = new InputStd({ props: inputstd_props, $$inline: true });
    	binding_callbacks.push(() => bind(inputstd, "value", inputstd_value_binding));
    	inputstd.$on("focus", /*focus_handler*/ ctx[13]);
    	inputstd.$on("blur", /*blur_handler*/ ctx[14]);
    	inputstd.$on("keydown", /*keydown_handler*/ ctx[15]);
    	inputstd.$on("input", /*input_handler*/ ctx[16]);

    	const block = {
    		c: function create() {
    			create_component(inputstd.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(inputstd, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const inputstd_changes = {};
    			if (dirty & /*label*/ 2) inputstd_changes.label = /*label*/ ctx[1];
    			if (dirty & /*borderColor*/ 4) inputstd_changes.borderColor = /*borderColor*/ ctx[2];
    			if (dirty & /*labelColor*/ 8) inputstd_changes.labelColor = /*labelColor*/ ctx[3];
    			if (dirty & /*helperText*/ 16) inputstd_changes.helperText = /*helperText*/ ctx[4];
    			if (dirty & /*icon*/ 128) inputstd_changes.icon = /*icon*/ ctx[7];
    			if (dirty & /*helperTextColor*/ 32) inputstd_changes.helperTextColor = /*helperTextColor*/ ctx[5];

    			if (!updating_value && dirty & /*value*/ 1) {
    				updating_value = true;
    				inputstd_changes.value = /*value*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			inputstd.$set(inputstd_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(inputstd.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(inputstd.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(inputstd, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(31:0) {#if !outlined}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*outlined*/ ctx[6]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { label = "" } = $$props;
    	let { value = "" } = $$props;
    	let { borderColor = "border-blue-700" } = $$props;
    	let { labelColor = "text-blue-700" } = $$props;
    	let { helperText = "" } = $$props;
    	let { helperTextColor = "" } = $$props;
    	let { outlined = false } = $$props;
    	let { icon = "" } = $$props;
    	let lblColor = labelColor;
    	let hasFocus = false;
    	let labelCls = "absolute left-0 px-2 text-sm text-gray-600";
    	let outlinedlabelCls = "";

    	const writable_props = [
    		"label",
    		"value",
    		"borderColor",
    		"labelColor",
    		"helperText",
    		"helperTextColor",
    		"outlined",
    		"icon"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Input> was created with unknown prop '${key}'`);
    	});

    	function inputstd_value_binding(value_1) {
    		value = value_1;
    		$$invalidate(0, value);
    	}

    	function focus_handler(event) {
    		bubble($$self, event);
    	}

    	function blur_handler(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler(event) {
    		bubble($$self, event);
    	}

    	function input_handler(event) {
    		bubble($$self, event);
    	}

    	function inputoutlined_value_binding(value_1) {
    		value = value_1;
    		$$invalidate(0, value);
    	}

    	function focus_handler_1(event) {
    		bubble($$self, event);
    	}

    	function blur_handler_1(event) {
    		bubble($$self, event);
    	}

    	function keydown_handler_1(event) {
    		bubble($$self, event);
    	}

    	function input_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("label" in $$props) $$invalidate(1, label = $$props.label);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("borderColor" in $$props) $$invalidate(2, borderColor = $$props.borderColor);
    		if ("labelColor" in $$props) $$invalidate(3, labelColor = $$props.labelColor);
    		if ("helperText" in $$props) $$invalidate(4, helperText = $$props.helperText);
    		if ("helperTextColor" in $$props) $$invalidate(5, helperTextColor = $$props.helperTextColor);
    		if ("outlined" in $$props) $$invalidate(6, outlined = $$props.outlined);
    		if ("icon" in $$props) $$invalidate(7, icon = $$props.icon);
    	};

    	$$self.$capture_state = () => {
    		return {
    			label,
    			value,
    			borderColor,
    			labelColor,
    			helperText,
    			helperTextColor,
    			outlined,
    			icon,
    			lblColor,
    			hasFocus,
    			labelCls,
    			outlinedlabelCls
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("label" in $$props) $$invalidate(1, label = $$props.label);
    		if ("value" in $$props) $$invalidate(0, value = $$props.value);
    		if ("borderColor" in $$props) $$invalidate(2, borderColor = $$props.borderColor);
    		if ("labelColor" in $$props) $$invalidate(3, labelColor = $$props.labelColor);
    		if ("helperText" in $$props) $$invalidate(4, helperText = $$props.helperText);
    		if ("helperTextColor" in $$props) $$invalidate(5, helperTextColor = $$props.helperTextColor);
    		if ("outlined" in $$props) $$invalidate(6, outlined = $$props.outlined);
    		if ("icon" in $$props) $$invalidate(7, icon = $$props.icon);
    		if ("lblColor" in $$props) lblColor = $$props.lblColor;
    		if ("hasFocus" in $$props) $$invalidate(9, hasFocus = $$props.hasFocus);
    		if ("labelCls" in $$props) labelCls = $$props.labelCls;
    		if ("outlinedlabelCls" in $$props) outlinedlabelCls = $$props.outlinedlabelCls;
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value*/ 1) {
    			 if (hasFocus) ; else {
    				if (value.length > 0) ;
    			}
    		}
    	};

    	return [
    		value,
    		label,
    		borderColor,
    		labelColor,
    		helperText,
    		helperTextColor,
    		outlined,
    		icon,
    		lblColor,
    		hasFocus,
    		labelCls,
    		outlinedlabelCls,
    		inputstd_value_binding,
    		focus_handler,
    		blur_handler,
    		keydown_handler,
    		input_handler,
    		inputoutlined_value_binding,
    		focus_handler_1,
    		blur_handler_1,
    		keydown_handler_1,
    		input_handler_1
    	];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$4, safe_not_equal, {
    			label: 1,
    			value: 0,
    			borderColor: 2,
    			labelColor: 3,
    			helperText: 4,
    			helperTextColor: 5,
    			outlined: 6,
    			icon: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$4.name
    		});
    	}

    	get label() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get borderColor() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set borderColor(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelColor() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelColor(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helperText() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helperText(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helperTextColor() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helperTextColor(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outlined() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outlined(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\widgets\Autocomplete.svelte generated by Svelte v3.18.1 */
    const file$3 = "src\\widgets\\Autocomplete.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[30] = list[i];
    	child_ctx[32] = i;
    	return child_ctx;
    }

    // (133:4) {:else}
    function create_else_block$1(ctx) {
    	let div;
    	let t;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*noResultsText*/ ctx[2]);
    			attr_dev(div, "class", "m-3");
    			add_location(div, file$3, 133, 6, 3745);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    			dispose = listen_dev(div, "mousedown", stop_propagation(prevent_default(/*mousedown_handler*/ ctx[26])), false, true, true);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*noResultsText*/ 4) set_data_dev(t, /*noResultsText*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(133:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (125:4) {#if filteredListItems.length>0}
    function create_if_block$1(ctx) {
    	let ul;
    	let each_value = /*filteredListItems*/ ctx[9];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "my-2");
    			add_location(ul, file$3, 125, 6, 3398);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*highlightIndex, setVal, filteredListItems, labelFieldName*/ 49920) {
    				each_value = /*filteredListItems*/ ctx[9];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(125:4) {#if filteredListItems.length>0}",
    		ctx
    	});

    	return block;
    }

    // (127:8) {#each filteredListItems as item,i}
    function create_each_block(ctx) {
    	let li;

    	let t_value = (/*labelFieldName*/ ctx[8]
    	? /*item*/ ctx[30][/*labelFieldName*/ ctx[8]]
    	: /*item*/ ctx[30]) + "";

    	let t;
    	let li_class_value;
    	let dispose;

    	const block = {
    		c: function create() {
    			li = element("li");
    			t = text(t_value);

    			attr_dev(li, "class", li_class_value = `p-3 cursor-pointer hover:bg-gray-200 ${/*highlightIndex*/ ctx[14] === /*i*/ ctx[32]
			? "bg-gray-300"
			: ""}`);

    			add_location(li, file$3, 127, 10, 3472);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, t);

    			dispose = listen_dev(
    				li,
    				"click",
    				stop_propagation(prevent_default(function () {
    					if (is_function(/*setVal*/ ctx[15](/*item*/ ctx[30]))) /*setVal*/ ctx[15](/*item*/ ctx[30]).apply(this, arguments);
    				})),
    				false,
    				true,
    				true
    			);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*labelFieldName, filteredListItems*/ 768 && t_value !== (t_value = (/*labelFieldName*/ ctx[8]
    			? /*item*/ ctx[30][/*labelFieldName*/ ctx[8]]
    			: /*item*/ ctx[30]) + "")) set_data_dev(t, t_value);

    			if (dirty[0] & /*highlightIndex*/ 16384 && li_class_value !== (li_class_value = `p-3 cursor-pointer hover:bg-gray-200 ${/*highlightIndex*/ ctx[14] === /*i*/ ctx[32]
			? "bg-gray-300"
			: ""}`)) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(127:8) {#each filteredListItems as item,i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div1;
    	let updating_value;
    	let t;
    	let div0;
    	let div0_class_value;
    	let current;
    	let dispose;

    	function input_value_binding(value_1) {
    		/*input_value_binding*/ ctx[27].call(null, value_1);
    	}

    	let input_props = {
    		outlined: /*outlined*/ ctx[7],
    		icon: /*icon*/ ctx[13],
    		label: /*label*/ ctx[0],
    		labelColor: /*labelColor*/ ctx[4],
    		borderColor: /*borderColor*/ ctx[3],
    		helperText: /*helperText*/ ctx[5],
    		helperTextColor: /*helperTextColor*/ ctx[6]
    	};

    	if (/*text*/ ctx[10] !== void 0) {
    		input_props.value = /*text*/ ctx[10];
    	}

    	const input = new Input({ props: input_props, $$inline: true });
    	binding_callbacks.push(() => bind(input, "value", input_value_binding));
    	input.$on("keydown", /*handleKeydown*/ ctx[16]);
    	input.$on("blur", /*onBlur*/ ctx[18]);
    	input.$on("focus", /*onFocus*/ ctx[17]);

    	function select_block_type(ctx, dirty) {
    		if (/*filteredListItems*/ ctx[9].length > 0) return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			create_component(input.$$.fragment);
    			t = space();
    			div0 = element("div");
    			if_block.c();
    			set_style(div0, "max-height", "320px");

    			attr_dev(div0, "class", div0_class_value = `absolute bg-white -mt-4 rounded-sm w-full elevation-4 z-10 overflow-y-auto ${/*listVisible*/ ctx[11] && /*text*/ ctx[10].length >= /*minCharactersToSearch*/ ctx[1]
			? ""
			: "hidden"}`);

    			add_location(div0, file$3, 119, 2, 3047);
    			attr_dev(div1, "class", "relative");
    			add_location(div1, file$3, 112, 0, 2785);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			mount_component(input, div1, null);
    			append_dev(div1, t);
    			append_dev(div1, div0);
    			if_block.m(div0, null);
    			current = true;

    			dispose = [
    				listen_dev(div0, "mouseenter", /*mouseenter_handler*/ ctx[28], false, false, false),
    				listen_dev(div0, "mouseleave", /*mouseleave_handler*/ ctx[29], false, false, false)
    			];
    		},
    		p: function update(ctx, dirty) {
    			const input_changes = {};
    			if (dirty[0] & /*outlined*/ 128) input_changes.outlined = /*outlined*/ ctx[7];
    			if (dirty[0] & /*icon*/ 8192) input_changes.icon = /*icon*/ ctx[13];
    			if (dirty[0] & /*label*/ 1) input_changes.label = /*label*/ ctx[0];
    			if (dirty[0] & /*labelColor*/ 16) input_changes.labelColor = /*labelColor*/ ctx[4];
    			if (dirty[0] & /*borderColor*/ 8) input_changes.borderColor = /*borderColor*/ ctx[3];
    			if (dirty[0] & /*helperText*/ 32) input_changes.helperText = /*helperText*/ ctx[5];
    			if (dirty[0] & /*helperTextColor*/ 64) input_changes.helperTextColor = /*helperTextColor*/ ctx[6];

    			if (!updating_value && dirty[0] & /*text*/ 1024) {
    				updating_value = true;
    				input_changes.value = /*text*/ ctx[10];
    				add_flush_callback(() => updating_value = false);
    			}

    			input.$set(input_changes);

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}

    			if (!current || dirty[0] & /*listVisible, text, minCharactersToSearch*/ 3074 && div0_class_value !== (div0_class_value = `absolute bg-white -mt-4 rounded-sm w-full elevation-4 z-10 overflow-y-auto ${/*listVisible*/ ctx[11] && /*text*/ ctx[10].length >= /*minCharactersToSearch*/ ctx[1]
			? ""
			: "hidden"}`)) {
    				attr_dev(div0, "class", div0_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(input);
    			if_block.d();
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function up(listSize, currentIndex) {
    	if (currentIndex === 0 || currentIndex === -1) {
    		return listSize - 1;
    	}

    	return currentIndex - 1;
    }

    function down(listSize, currentIndex) {
    	if (currentIndex === listSize - 1) {
    		return 0;
    	}

    	return currentIndex + 1;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	let { label = "" } = $$props;
    	let { items = [] } = $$props;
    	let { value = "" } = $$props;
    	let { minCharactersToSearch = 0 } = $$props;
    	let { noResultsText = "No results found" } = $$props;
    	let { maxLen = undefined } = $$props;
    	let { borderColor = "border-gray-700" } = $$props;
    	let { labelColor = "text-gray-700" } = $$props;
    	let { helperText = "" } = $$props;
    	let { helperTextColor = "" } = $$props;
    	let { outlined = false } = $$props;
    	let { labelFieldName = undefined } = $$props;
    	let { keywordsFieldName = labelFieldName } = $$props;

    	let { keywordsFunction = function (item) {
    		if (item === undefined || item === null) {
    			return "";
    		}

    		return keywordsFieldName
    		? item[keywordsFieldName].toLowerCase()
    		: item.toLowerCase();
    	} } = $$props;

    	let filteredListItems = [];
    	let text = "";
    	let listVisible = false;
    	let itemClicked = false;
    	let icon;
    	let highlightIndex = -1;

    	function setText(v) {
    		$$invalidate(10, text = v);
    	}

    	function setVal(item) {
    		$$invalidate(12, itemClicked = false);
    		$$invalidate(11, listVisible = false);
    		$$invalidate(14, highlightIndex = -1);

    		if (value !== item) {
    			$$invalidate(19, value = item);
    			dispatch("change", item);
    		}
    	}

    	function handleKeydown(e) {
    		$$invalidate(11, listVisible = e.key !== "Escape");

    		if (e.key === "ArrowDown") {
    			$$invalidate(14, highlightIndex = down(filteredListItems.length, highlightIndex));
    		} else if (e.key === "ArrowUp") {
    			$$invalidate(14, highlightIndex = up(filteredListItems.length, highlightIndex));
    		} else if (e.key === "Escape") {
    			$$invalidate(14, highlightIndex = -1);
    		} else if (e.key === "Enter") {
    			if (highlightIndex >= 0 && highlightIndex < filteredListItems.length) {
    				setVal(filteredListItems[highlightIndex]);
    			}
    		}
    	}

    	function onFocus(e) {
    		$$invalidate(11, listVisible = true);

    		if (text) {
    			e.target.selectionStart = 0;
    			e.target.selectionEnd = text.length;
    		}
    	}

    	function onBlur() {
    		if (itemClicked) return;
    		$$invalidate(11, listVisible = false);

    		if (typeof value === "string") {
    			$$invalidate(10, text = value || "");
    		} else {
    			$$invalidate(10, text = value[labelFieldName] || "");
    		}

    		$$invalidate(14, highlightIndex = -1);
    	}

    	const writable_props = [
    		"label",
    		"items",
    		"value",
    		"minCharactersToSearch",
    		"noResultsText",
    		"maxLen",
    		"borderColor",
    		"labelColor",
    		"helperText",
    		"helperTextColor",
    		"outlined",
    		"labelFieldName",
    		"keywordsFieldName",
    		"keywordsFunction"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Autocomplete> was created with unknown prop '${key}'`);
    	});

    	function mousedown_handler(event) {
    		bubble($$self, event);
    	}

    	function input_value_binding(value_1) {
    		text = value_1;
    		$$invalidate(10, text);
    	}

    	const mouseenter_handler = () => $$invalidate(12, itemClicked = true);
    	const mouseleave_handler = () => $$invalidate(12, itemClicked = false);

    	$$self.$set = $$props => {
    		if ("label" in $$props) $$invalidate(0, label = $$props.label);
    		if ("items" in $$props) $$invalidate(20, items = $$props.items);
    		if ("value" in $$props) $$invalidate(19, value = $$props.value);
    		if ("minCharactersToSearch" in $$props) $$invalidate(1, minCharactersToSearch = $$props.minCharactersToSearch);
    		if ("noResultsText" in $$props) $$invalidate(2, noResultsText = $$props.noResultsText);
    		if ("maxLen" in $$props) $$invalidate(21, maxLen = $$props.maxLen);
    		if ("borderColor" in $$props) $$invalidate(3, borderColor = $$props.borderColor);
    		if ("labelColor" in $$props) $$invalidate(4, labelColor = $$props.labelColor);
    		if ("helperText" in $$props) $$invalidate(5, helperText = $$props.helperText);
    		if ("helperTextColor" in $$props) $$invalidate(6, helperTextColor = $$props.helperTextColor);
    		if ("outlined" in $$props) $$invalidate(7, outlined = $$props.outlined);
    		if ("labelFieldName" in $$props) $$invalidate(8, labelFieldName = $$props.labelFieldName);
    		if ("keywordsFieldName" in $$props) $$invalidate(22, keywordsFieldName = $$props.keywordsFieldName);
    		if ("keywordsFunction" in $$props) $$invalidate(23, keywordsFunction = $$props.keywordsFunction);
    	};

    	$$self.$capture_state = () => {
    		return {
    			label,
    			items,
    			value,
    			minCharactersToSearch,
    			noResultsText,
    			maxLen,
    			borderColor,
    			labelColor,
    			helperText,
    			helperTextColor,
    			outlined,
    			labelFieldName,
    			keywordsFieldName,
    			keywordsFunction,
    			filteredListItems,
    			text,
    			listVisible,
    			itemClicked,
    			icon,
    			highlightIndex
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("label" in $$props) $$invalidate(0, label = $$props.label);
    		if ("items" in $$props) $$invalidate(20, items = $$props.items);
    		if ("value" in $$props) $$invalidate(19, value = $$props.value);
    		if ("minCharactersToSearch" in $$props) $$invalidate(1, minCharactersToSearch = $$props.minCharactersToSearch);
    		if ("noResultsText" in $$props) $$invalidate(2, noResultsText = $$props.noResultsText);
    		if ("maxLen" in $$props) $$invalidate(21, maxLen = $$props.maxLen);
    		if ("borderColor" in $$props) $$invalidate(3, borderColor = $$props.borderColor);
    		if ("labelColor" in $$props) $$invalidate(4, labelColor = $$props.labelColor);
    		if ("helperText" in $$props) $$invalidate(5, helperText = $$props.helperText);
    		if ("helperTextColor" in $$props) $$invalidate(6, helperTextColor = $$props.helperTextColor);
    		if ("outlined" in $$props) $$invalidate(7, outlined = $$props.outlined);
    		if ("labelFieldName" in $$props) $$invalidate(8, labelFieldName = $$props.labelFieldName);
    		if ("keywordsFieldName" in $$props) $$invalidate(22, keywordsFieldName = $$props.keywordsFieldName);
    		if ("keywordsFunction" in $$props) $$invalidate(23, keywordsFunction = $$props.keywordsFunction);
    		if ("filteredListItems" in $$props) $$invalidate(9, filteredListItems = $$props.filteredListItems);
    		if ("text" in $$props) $$invalidate(10, text = $$props.text);
    		if ("listVisible" in $$props) $$invalidate(11, listVisible = $$props.listVisible);
    		if ("itemClicked" in $$props) $$invalidate(12, itemClicked = $$props.itemClicked);
    		if ("icon" in $$props) $$invalidate(13, icon = $$props.icon);
    		if ("highlightIndex" in $$props) $$invalidate(14, highlightIndex = $$props.highlightIndex);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*listVisible*/ 2048) {
    			 $$invalidate(13, icon = listVisible ? "arrow_drop_up" : "arrow_drop_down");
    		}

    		if ($$self.$$.dirty[0] & /*text, minCharactersToSearch, items, keywordsFunction, maxLen*/ 11535362) {
    			 {
    				if (text.length >= minCharactersToSearch) {
    					const tempFiltered = items.filter(it => keywordsFunction(it).includes(text.toLowerCase()));
    					$$invalidate(9, filteredListItems = maxLen ? tempFiltered.slice(0, maxLen) : tempFiltered);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*value, labelFieldName*/ 524544) {
    			 if (typeof value === "string") {
    				setText(value || "");
    			} else {
    				setText(value[labelFieldName] || "");
    			}
    		}
    	};

    	return [
    		label,
    		minCharactersToSearch,
    		noResultsText,
    		borderColor,
    		labelColor,
    		helperText,
    		helperTextColor,
    		outlined,
    		labelFieldName,
    		filteredListItems,
    		text,
    		listVisible,
    		itemClicked,
    		icon,
    		highlightIndex,
    		setVal,
    		handleKeydown,
    		onFocus,
    		onBlur,
    		value,
    		items,
    		maxLen,
    		keywordsFieldName,
    		keywordsFunction,
    		dispatch,
    		setText,
    		mousedown_handler,
    		input_value_binding,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class Autocomplete extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$4,
    			create_fragment$5,
    			safe_not_equal,
    			{
    				label: 0,
    				items: 20,
    				value: 19,
    				minCharactersToSearch: 1,
    				noResultsText: 2,
    				maxLen: 21,
    				borderColor: 3,
    				labelColor: 4,
    				helperText: 5,
    				helperTextColor: 6,
    				outlined: 7,
    				labelFieldName: 8,
    				keywordsFieldName: 22,
    				keywordsFunction: 23
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Autocomplete",
    			options,
    			id: create_fragment$5.name
    		});
    	}

    	get label() {
    		throw new Error("<Autocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Autocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get items() {
    		throw new Error("<Autocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set items(value) {
    		throw new Error("<Autocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Autocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Autocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get minCharactersToSearch() {
    		throw new Error("<Autocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set minCharactersToSearch(value) {
    		throw new Error("<Autocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get noResultsText() {
    		throw new Error("<Autocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set noResultsText(value) {
    		throw new Error("<Autocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxLen() {
    		throw new Error("<Autocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxLen(value) {
    		throw new Error("<Autocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get borderColor() {
    		throw new Error("<Autocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set borderColor(value) {
    		throw new Error("<Autocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelColor() {
    		throw new Error("<Autocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelColor(value) {
    		throw new Error("<Autocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helperText() {
    		throw new Error("<Autocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helperText(value) {
    		throw new Error("<Autocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get helperTextColor() {
    		throw new Error("<Autocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set helperTextColor(value) {
    		throw new Error("<Autocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outlined() {
    		throw new Error("<Autocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outlined(value) {
    		throw new Error("<Autocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelFieldName() {
    		throw new Error("<Autocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelFieldName(value) {
    		throw new Error("<Autocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get keywordsFieldName() {
    		throw new Error("<Autocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set keywordsFieldName(value) {
    		throw new Error("<Autocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get keywordsFunction() {
    		throw new Error("<Autocomplete>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set keywordsFunction(value) {
    		throw new Error("<Autocomplete>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity }) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 }) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }

    /* src\widgets\NavigationDrawer.svelte generated by Svelte v3.18.1 */
    const file$4 = "src\\widgets\\NavigationDrawer.svelte";

    // (22:2) {#if visible}
    function create_if_block_2(ctx) {
    	let div;
    	let div_class_value;
    	let div_transition;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = `elevation-8 fixed top-0 bottom-0 left-0 z-40 ${/*marginTop*/ ctx[2]}`);
    			add_location(div, file$4, 22, 4, 657);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 8) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[3], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null));
    			}

    			if (!current || dirty & /*marginTop*/ 4 && div_class_value !== (div_class_value = `elevation-8 fixed top-0 bottom-0 left-0 z-40 ${/*marginTop*/ ctx[2]}`)) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { x: -300, duration: 300 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fly, { x: -300, duration: 300 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(22:2) {#if visible}",
    		ctx
    	});

    	return block;
    }

    // (8:0) {#if modal}
    function create_if_block$2(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*visible*/ ctx[0] && create_if_block_1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*visible*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(8:0) {#if modal}",
    		ctx
    	});

    	return block;
    }

    // (9:2) {#if visible}
    function create_if_block_1(ctx) {
    	let div2;
    	let div0;
    	let div0_transition;
    	let t;
    	let div1;
    	let div1_transition;
    	let div2_class_value;
    	let current;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "w-full h-full fixed left-0 bg-black opacity-50 z-30");
    			add_location(div0, file$4, 11, 6, 280);
    			attr_dev(div1, "class", "elevation-8 z-40");
    			toggle_class(div1, "`${marginTop}`", /*marginTop*/ ctx[2]);
    			add_location(div1, file$4, 14, 6, 446);
    			attr_dev(div2, "class", div2_class_value = `flex fixed top-0 bottom-0 z-40 left-0 right-0 ${/*marginTop*/ ctx[2]}`);
    			add_location(div2, file$4, 9, 4, 189);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;
    			dispose = listen_dev(div0, "click", /*click_handler*/ ctx[5], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 8) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[3], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null));
    			}

    			if (dirty & /*marginTop*/ 4) {
    				toggle_class(div1, "`${marginTop}`", /*marginTop*/ ctx[2]);
    			}

    			if (!current || dirty & /*marginTop*/ 4 && div2_class_value !== (div2_class_value = `flex fixed top-0 bottom-0 z-40 left-0 right-0 ${/*marginTop*/ ctx[2]}`)) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fade, { duration: 300 }, true);
    				div0_transition.run(1);
    			});

    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fly, { x: -300, duration: 300 }, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fade, { duration: 300 }, false);
    			div0_transition.run(0);
    			transition_out(default_slot, local);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, fly, { x: -300, duration: 300 }, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching && div0_transition) div0_transition.end();
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div1_transition) div1_transition.end();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(9:2) {#if visible}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$2, create_if_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*modal*/ ctx[1]) return 0;
    		if (/*visible*/ ctx[0]) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let { modal = false } = $$props;
    	let { visible = false } = $$props;
    	let { marginTop = "" } = $$props;
    	const writable_props = ["modal", "visible", "marginTop"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<NavigationDrawer> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	const click_handler = () => $$invalidate(0, visible = !visible);

    	$$self.$set = $$props => {
    		if ("modal" in $$props) $$invalidate(1, modal = $$props.modal);
    		if ("visible" in $$props) $$invalidate(0, visible = $$props.visible);
    		if ("marginTop" in $$props) $$invalidate(2, marginTop = $$props.marginTop);
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return { modal, visible, marginTop };
    	};

    	$$self.$inject_state = $$props => {
    		if ("modal" in $$props) $$invalidate(1, modal = $$props.modal);
    		if ("visible" in $$props) $$invalidate(0, visible = $$props.visible);
    		if ("marginTop" in $$props) $$invalidate(2, marginTop = $$props.marginTop);
    	};

    	return [visible, modal, marginTop, $$scope, $$slots, click_handler];
    }

    class NavigationDrawer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$6, safe_not_equal, { modal: 1, visible: 0, marginTop: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NavigationDrawer",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get modal() {
    		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set modal(value) {
    		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get visible() {
    		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visible(value) {
    		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get marginTop() {
    		throw new Error("<NavigationDrawer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set marginTop(value) {
    		throw new Error("<NavigationDrawer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\widgets\Dialog.svelte generated by Svelte v3.18.1 */
    const file$5 = "src\\widgets\\Dialog.svelte";

    // (8:0) {#if visible}
    function create_if_block$3(ctx) {
    	let div2;
    	let div0;
    	let div0_transition;
    	let t;
    	let div1;
    	let div1_transition;
    	let current;
    	let dispose;
    	const default_slot_template = /*$$slots*/ ctx[3].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "absolute h-full w-full bg-black opacity-50");
    			add_location(div0, file$5, 9, 4, 236);
    			attr_dev(div1, "class", "z-40");
    			add_location(div1, file$5, 13, 4, 410);
    			attr_dev(div2, "class", "fixed top-0 bottom-0 left-0 right-0 flex justify-center items-center z-40");
    			add_location(div2, file$5, 8, 2, 144);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			current = true;
    			dispose = listen_dev(div0, "click", /*click_handler*/ ctx[4], false, false, false);
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot && default_slot.p && dirty & /*$$scope*/ 4) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[2], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[2], dirty, null));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fade, { duration: 100 }, true);
    				div0_transition.run(1);
    			});

    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, scale, { duration: 200 }, true);
    				div1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div0_transition) div0_transition = create_bidirectional_transition(div0, fade, { duration: 100 }, false);
    			div0_transition.run(0);
    			transition_out(default_slot, local);
    			if (!div1_transition) div1_transition = create_bidirectional_transition(div1, scale, { duration: 200 }, false);
    			div1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (detaching && div0_transition) div0_transition.end();
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div1_transition) div1_transition.end();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(8:0) {#if visible}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*visible*/ ctx[0] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*visible*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    					transition_in(if_block, 1);
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { visible = false } = $$props;
    	let { permanent = false } = $$props;
    	const writable_props = ["visible", "permanent"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Dialog> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	const click_handler = () => {
    		if (!permanent) $$invalidate(0, visible = false);
    	};

    	$$self.$set = $$props => {
    		if ("visible" in $$props) $$invalidate(0, visible = $$props.visible);
    		if ("permanent" in $$props) $$invalidate(1, permanent = $$props.permanent);
    		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return { visible, permanent };
    	};

    	$$self.$inject_state = $$props => {
    		if ("visible" in $$props) $$invalidate(0, visible = $$props.visible);
    		if ("permanent" in $$props) $$invalidate(1, permanent = $$props.permanent);
    	};

    	return [visible, permanent, $$scope, $$slots, click_handler];
    }

    class Dialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$7, safe_not_equal, { visible: 0, permanent: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dialog",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get visible() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set visible(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get permanent() {
    		throw new Error("<Dialog>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set permanent(value) {
    		throw new Error("<Dialog>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\widgets\Slider.svelte generated by Svelte v3.18.1 */

    const { Error: Error_1 } = globals;
    const file$6 = "src\\widgets\\Slider.svelte";

    function create_fragment$8(ctx) {
    	let div4;
    	let div1;
    	let div0;
    	let div0_class_value;
    	let div1_class_value;
    	let t0;
    	let div3;
    	let svg;
    	let circle;
    	let svg_class_value;
    	let t1;
    	let div2;
    	let div2_class_value;
    	let div4_resize_listener;
    	let dispose;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div3 = element("div");
    			svg = svg_element("svg");
    			circle = svg_element("circle");
    			t1 = space();
    			div2 = element("div");
    			attr_dev(div0, "class", div0_class_value = "h-full w-full absolute mdc-slider__track " + /*trackFilledColor*/ ctx[2] + " svelte-xdkrm7");
    			set_style(div0, "transform", "scaleX(" + /*normalisedValue*/ ctx[3] + ")");
    			add_location(div0, file$6, 196, 4, 7598);
    			attr_dev(div1, "class", div1_class_value = "absolute w-full mdc-slider__track-container " + /*trackEmptyColor*/ ctx[1] + " svelte-xdkrm7");
    			add_location(div1, file$6, 195, 2, 7518);
    			attr_dev(circle, "cx", "10.5");
    			attr_dev(circle, "cy", "10.5");
    			attr_dev(circle, "r", "7.875");
    			add_location(circle, file$6, 208, 6, 8045);
    			attr_dev(svg, "class", svg_class_value = "absolute left-0 top-0 fill-current " + /*thumbColor*/ ctx[0] + " mdc-slider__thumb" + " svelte-xdkrm7");
    			set_style(svg, "transform", "scale(" + /*thumbSize*/ ctx[6] + ")");
    			attr_dev(svg, "width", "21");
    			attr_dev(svg, "height", "21");
    			add_location(svg, file$6, 203, 4, 7873);
    			set_style(div2, "transform", "scale(1.125)");
    			attr_dev(div2, "class", div2_class_value = "mdc-slider__focus-ring " + /*trackFilledColor*/ ctx[2] + " hover:opacity-25\n      opacity-0" + " svelte-xdkrm7");
    			add_location(div2, file$6, 210, 4, 8100);
    			attr_dev(div3, "class", "mdc-slider__thumb-container svelte-xdkrm7");
    			set_style(div3, "transform", "translateX(" + /*width*/ ctx[4] * /*normalisedValue*/ ctx[3] + "px) translateX(-50%)");
    			add_location(div3, file$6, 200, 2, 7742);
    			attr_dev(div4, "class", "relative w-full h-8 cursor-pointer block outline-none mdc-slider svelte-xdkrm7");
    			attr_dev(div4, "tabindex", "0");
    			attr_dev(div4, "role", "slider");
    			add_render_callback(() => /*div4_elementresize_handler*/ ctx[20].call(div4));
    			add_location(div4, file$6, 184, 0, 7064);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div1);
    			append_dev(div1, div0);
    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			append_dev(div3, svg);
    			append_dev(svg, circle);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			div4_resize_listener = add_resize_listener(div4, /*div4_elementresize_handler*/ ctx[20].bind(div4));
    			/*div4_binding*/ ctx[21](div4);

    			dispose = [
    				listen_dev(div4, "touchstart", stop_propagation(prevent_default(/*touchStart*/ ctx[7])), false, true, true),
    				listen_dev(div4, "touchmove", stop_propagation(prevent_default(/*touchMove*/ ctx[8])), false, true, true),
    				listen_dev(div4, "touchend", stop_propagation(prevent_default(/*dragEnd*/ ctx[10])), false, true, true),
    				listen_dev(div4, "pointerdown", stop_propagation(prevent_default(/*dragStart*/ ctx[9])), false, true, true),
    				listen_dev(div4, "pointerup", stop_propagation(prevent_default(/*dragEnd*/ ctx[10])), false, true, true)
    			];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*trackFilledColor*/ 4 && div0_class_value !== (div0_class_value = "h-full w-full absolute mdc-slider__track " + /*trackFilledColor*/ ctx[2] + " svelte-xdkrm7")) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*normalisedValue*/ 8) {
    				set_style(div0, "transform", "scaleX(" + /*normalisedValue*/ ctx[3] + ")");
    			}

    			if (dirty & /*trackEmptyColor*/ 2 && div1_class_value !== (div1_class_value = "absolute w-full mdc-slider__track-container " + /*trackEmptyColor*/ ctx[1] + " svelte-xdkrm7")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty & /*thumbColor*/ 1 && svg_class_value !== (svg_class_value = "absolute left-0 top-0 fill-current " + /*thumbColor*/ ctx[0] + " mdc-slider__thumb" + " svelte-xdkrm7")) {
    				attr_dev(svg, "class", svg_class_value);
    			}

    			if (dirty & /*thumbSize*/ 64) {
    				set_style(svg, "transform", "scale(" + /*thumbSize*/ ctx[6] + ")");
    			}

    			if (dirty & /*trackFilledColor*/ 4 && div2_class_value !== (div2_class_value = "mdc-slider__focus-ring " + /*trackFilledColor*/ ctx[2] + " hover:opacity-25\n      opacity-0" + " svelte-xdkrm7")) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (dirty & /*width, normalisedValue*/ 24) {
    				set_style(div3, "transform", "translateX(" + /*width*/ ctx[4] * /*normalisedValue*/ ctx[3] + "px) translateX(-50%)");
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			div4_resize_listener.cancel();
    			/*div4_binding*/ ctx[21](null);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function roundToStep(v, step) {
    	if (step == null) {
    		return v;
    	}

    	return Math.round(v / step) * step;
    }

    function scaleValue(v, oldMin, oldMax, newMin, newMax) {
    	if (v < oldMin) {
    		return newMin;
    	}

    	if (v > oldMax) {
    		return newMax;
    	}

    	const oldRange = oldMax - oldMin;
    	const newRange = newMax - newMin;

    	if (oldRange <= 0 || newRange <= 0) {
    		throw new Error("max should be greater than min");
    	}

    	return +((v - oldMin) * newRange / oldRange + newMin).toPrecision(12);
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { value } = $$props;
    	let { min = 0 } = $$props;
    	let { max = 1 } = $$props;
    	let { step = undefined } = $$props;
    	let { thumbColor = "text-blue-500" } = $$props;
    	let { trackEmptyColor = "bg-blue-200" } = $$props;
    	let { trackFilledColor = "bg-blue-500" } = $$props;
    	let normalisedValue;
    	let normalisedStep = undefined;
    	let width;
    	let container;
    	let oldVal;
    	let dragStartX;
    	let mousedown = false;

    	function touchStart(e) {
    		if (window.PointerEvent) {
    			return;
    		}

    		const rect = container.getBoundingClientRect();
    		const x = e.touches[0].clientX - rect.left;
    		const v = x / width;

    		if (v < 0) {
    			$$invalidate(3, normalisedValue = 0);
    		} else if (v > 1) {
    			$$invalidate(3, normalisedValue = 1);
    		} else {
    			$$invalidate(3, normalisedValue = roundToStep(v, normalisedStep));
    		}

    		dragStartX = e.touches[0].screenX;
    		oldVal = normalisedValue;
    		$$invalidate(11, value = scaleValue(normalisedValue, 0, 1, min, max));
    		$$invalidate(18, mousedown = true);
    	}

    	function touchMove(e) {
    		if (window.PointerEvent) {
    			return;
    		}

    		if (!mousedown) {
    			return;
    		}

    		const change = e.touches[0].screenX - dragStartX;
    		const v = change / width + oldVal;

    		if (v < 0) {
    			$$invalidate(3, normalisedValue = 0);
    		} else if (v > 1) {
    			$$invalidate(3, normalisedValue = 1);
    		} else {
    			$$invalidate(3, normalisedValue = roundToStep(v, normalisedStep));
    		}

    		$$invalidate(11, value = scaleValue(normalisedValue, 0, 1, min, max));
    	}

    	function dragStart(e) {
    		const rect = container.getBoundingClientRect();
    		const x = e.clientX - rect.left; //x position within the element.
    		const v = x / width;

    		if (v < 0) {
    			$$invalidate(3, normalisedValue = 0);
    		} else if (v > 1) {
    			$$invalidate(3, normalisedValue = 1);
    		} else {
    			$$invalidate(3, normalisedValue = roundToStep(v, normalisedStep));
    		}

    		dragStartX = e.screenX;
    		oldVal = normalisedValue;
    		$$invalidate(18, mousedown = true);
    		$$invalidate(11, value = scaleValue(normalisedValue, 0, 1, min, max));
    		document.body.addEventListener("pointermove", dragging);
    	}

    	function dragging(e) {
    		if (e.pressure === 0) {
    			document.body.removeEventListener("pointermove", dragging);
    			$$invalidate(18, mousedown = false);
    			return;
    		}

    		if (!mousedown) {
    			return;
    		}

    		const change = e.screenX - dragStartX;
    		const v = change / width + oldVal;

    		if (v < 0) {
    			$$invalidate(3, normalisedValue = 0);
    		} else if (v > 1) {
    			$$invalidate(3, normalisedValue = 1);
    		} else {
    			$$invalidate(3, normalisedValue = roundToStep(v, normalisedStep));
    		}

    		$$invalidate(11, value = scaleValue(normalisedValue, 0, 1, min, max));
    	}

    	function dragEnd(e) {
    		document.body.removeEventListener("pointermove", dragging);
    		$$invalidate(18, mousedown = false);
    	}

    	let thumbSize = 0.75;

    	const writable_props = [
    		"value",
    		"min",
    		"max",
    		"step",
    		"thumbColor",
    		"trackEmptyColor",
    		"trackFilledColor"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Slider> was created with unknown prop '${key}'`);
    	});

    	function div4_elementresize_handler() {
    		width = this.clientWidth;
    		$$invalidate(4, width);
    	}

    	function div4_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(5, container = $$value);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("value" in $$props) $$invalidate(11, value = $$props.value);
    		if ("min" in $$props) $$invalidate(12, min = $$props.min);
    		if ("max" in $$props) $$invalidate(13, max = $$props.max);
    		if ("step" in $$props) $$invalidate(14, step = $$props.step);
    		if ("thumbColor" in $$props) $$invalidate(0, thumbColor = $$props.thumbColor);
    		if ("trackEmptyColor" in $$props) $$invalidate(1, trackEmptyColor = $$props.trackEmptyColor);
    		if ("trackFilledColor" in $$props) $$invalidate(2, trackFilledColor = $$props.trackFilledColor);
    	};

    	$$self.$capture_state = () => {
    		return {
    			value,
    			min,
    			max,
    			step,
    			thumbColor,
    			trackEmptyColor,
    			trackFilledColor,
    			normalisedValue,
    			normalisedStep,
    			width,
    			container,
    			oldVal,
    			dragStartX,
    			mousedown,
    			thumbSize
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("value" in $$props) $$invalidate(11, value = $$props.value);
    		if ("min" in $$props) $$invalidate(12, min = $$props.min);
    		if ("max" in $$props) $$invalidate(13, max = $$props.max);
    		if ("step" in $$props) $$invalidate(14, step = $$props.step);
    		if ("thumbColor" in $$props) $$invalidate(0, thumbColor = $$props.thumbColor);
    		if ("trackEmptyColor" in $$props) $$invalidate(1, trackEmptyColor = $$props.trackEmptyColor);
    		if ("trackFilledColor" in $$props) $$invalidate(2, trackFilledColor = $$props.trackFilledColor);
    		if ("normalisedValue" in $$props) $$invalidate(3, normalisedValue = $$props.normalisedValue);
    		if ("normalisedStep" in $$props) normalisedStep = $$props.normalisedStep;
    		if ("width" in $$props) $$invalidate(4, width = $$props.width);
    		if ("container" in $$props) $$invalidate(5, container = $$props.container);
    		if ("oldVal" in $$props) oldVal = $$props.oldVal;
    		if ("dragStartX" in $$props) dragStartX = $$props.dragStartX;
    		if ("mousedown" in $$props) $$invalidate(18, mousedown = $$props.mousedown);
    		if ("thumbSize" in $$props) $$invalidate(6, thumbSize = $$props.thumbSize);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*value, min, max*/ 14336) {
    			 $$invalidate(3, normalisedValue = scaleValue(value, min, max, 0, 1));
    		}

    		if ($$self.$$.dirty & /*step, max, min*/ 28672) {
    			 if (step != null) {
    				normalisedStep = step / (max - min);
    			} else {
    				normalisedStep = undefined;
    			}
    		}

    		if ($$self.$$.dirty & /*mousedown*/ 262144) {
    			 $$invalidate(6, thumbSize = mousedown ? 1.4 : 0.75);
    		}
    	};

    	return [
    		thumbColor,
    		trackEmptyColor,
    		trackFilledColor,
    		normalisedValue,
    		width,
    		container,
    		thumbSize,
    		touchStart,
    		touchMove,
    		dragStart,
    		dragEnd,
    		value,
    		min,
    		max,
    		step,
    		normalisedStep,
    		oldVal,
    		dragStartX,
    		mousedown,
    		dragging,
    		div4_elementresize_handler,
    		div4_binding
    	];
    }

    class Slider extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$8, safe_not_equal, {
    			value: 11,
    			min: 12,
    			max: 13,
    			step: 14,
    			thumbColor: 0,
    			trackEmptyColor: 1,
    			trackFilledColor: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Slider",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*value*/ ctx[11] === undefined && !("value" in props)) {
    			console.warn("<Slider> was created without expected prop 'value'");
    		}
    	}

    	get value() {
    		throw new Error_1("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error_1("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get min() {
    		throw new Error_1("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set min(value) {
    		throw new Error_1("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get max() {
    		throw new Error_1("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set max(value) {
    		throw new Error_1("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get step() {
    		throw new Error_1("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set step(value) {
    		throw new Error_1("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get thumbColor() {
    		throw new Error_1("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set thumbColor(value) {
    		throw new Error_1("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get trackEmptyColor() {
    		throw new Error_1("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set trackEmptyColor(value) {
    		throw new Error_1("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get trackFilledColor() {
    		throw new Error_1("<Slider>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set trackFilledColor(value) {
    		throw new Error_1("<Slider>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const countries = [
      {
        name: 'Afghanistan',
        code: 'AF',
      },
      {
        name: 'Åland Islands',
        code: 'AX',
      },
      {
        name: 'Albania',
        code: 'AL',
      },
      {
        name: 'Algeria',
        code: 'DZ',
      },
      {
        name: 'American Samoa',
        code: 'AS',
      },
      {
        name: 'Andorra',
        code: 'AD',
      },
      {
        name: 'Angola',
        code: 'AO',
      },
      {
        name: 'Anguilla',
        code: 'AI',
      },
      {
        name: 'Antarctica',
        code: 'AQ',
      },
      {
        name: 'Antigua and Barbuda',
        code: 'AG',
      },
      {
        name: 'Argentina',
        code: 'AR',
      },
      {
        name: 'Armenia',
        code: 'AM',
      },
      {
        name: 'Aruba',
        code: 'AW',
      },
      {
        name: 'Australia',
        code: 'AU',
      },
      {
        name: 'Austria',
        code: 'AT',
      },
      {
        name: 'Azerbaijan',
        code: 'AZ',
      },
      {
        name: 'Bahamas',
        code: 'BS',
      },
      {
        name: 'Bahrain',
        code: 'BH',
      },
      {
        name: 'Bangladesh',
        code: 'BD',
      },
      {
        name: 'Barbados',
        code: 'BB',
      },
      {
        name: 'Belarus',
        code: 'BY',
      },
      {
        name: 'Belgium',
        code: 'BE',
      },
      {
        name: 'Belize',
        code: 'BZ',
      },
      {
        name: 'Benin',
        code: 'BJ',
      },
      {
        name: 'Bermuda',
        code: 'BM',
      },
      {
        name: 'Bhutan',
        code: 'BT',
      },
      {
        name: 'Bolivia',
        code: 'BO',
      },
      {
        name: 'Bosnia and Herzegovina',
        code: 'BA',
      },
      {
        name: 'Botswana',
        code: 'BW',
      },
      {
        name: 'Bouvet Island',
        code: 'BV',
      },
      {
        name: 'Brazil',
        code: 'BR',
      },
      {
        name: 'British Indian Ocean Territory',
        code: 'IO',
      },
      {
        name: 'Brunei Darussalam',
        code: 'BN',
      },
      {
        name: 'Bulgaria',
        code: 'BG',
      },
      {
        name: 'Burkina Faso',
        code: 'BF',
      },
      {
        name: 'Burundi',
        code: 'BI',
      },
      {
        name: 'Cambodia',
        code: 'KH',
      },
      {
        name: 'Cameroon',
        code: 'CM',
      },
      {
        name: 'Canada',
        code: 'CA',
      },
      {
        name: 'Cape Verde',
        code: 'CV',
      },
      {
        name: 'Cayman Islands',
        code: 'KY',
      },
      {
        name: 'Central African Republic',
        code: 'CF',
      },
      {
        name: 'Chad',
        code: 'TD',
      },
      {
        name: 'Chile',
        code: 'CL',
      },
      {
        name: 'China',
        code: 'CN',
      },
      {
        name: 'Christmas Island',
        code: 'CX',
      },
      {
        name: 'Cocos (Keeling) Islands',
        code: 'CC',
      },
      {
        name: 'Colombia',
        code: 'CO',
      },
      {
        name: 'Comoros',
        code: 'KM',
      },
      {
        name: 'Congo',
        code: 'CG',
      },
      {
        name: 'Congo, The Democratic Republic of the',
        code: 'CD',
      },
      {
        name: 'Cook Islands',
        code: 'CK',
      },
      {
        name: 'Costa Rica',
        code: 'CR',
      },
      {
        name: 'Cote D\'Ivoire',
        code: 'CI',
      },
      {
        name: 'Croatia',
        code: 'HR',
      },
      {
        name: 'Cuba',
        code: 'CU',
      },
      {
        name: 'Cyprus',
        code: 'CY',
      },
      {
        name: 'Czech Republic',
        code: 'CZ',
      },
      {
        name: 'Denmark',
        code: 'DK',
      },
      {
        name: 'Djibouti',
        code: 'DJ',
      },
      {
        name: 'Dominica',
        code: 'DM',
      },
      {
        name: 'Dominican Republic',
        code: 'DO',
      },
      {
        name: 'Ecuador',
        code: 'EC',
      },
      {
        name: 'Egypt',
        code: 'EG',
      },
      {
        name: 'El Salvador',
        code: 'SV',
      },
      {
        name: 'Equatorial Guinea',
        code: 'GQ',
      },
      {
        name: 'Eritrea',
        code: 'ER',
      },
      {
        name: 'Estonia',
        code: 'EE',
      },
      {
        name: 'Ethiopia',
        code: 'ET',
      },
      {
        name: 'Falkland Islands (Malvinas)',
        code: 'FK',
      },
      {
        name: 'Faroe Islands',
        code: 'FO',
      },
      {
        name: 'Fiji',
        code: 'FJ',
      },
      {
        name: 'Finland',
        code: 'FI',
      },
      {
        name: 'France',
        code: 'FR',
      },
      {
        name: 'French Guiana',
        code: 'GF',
      },
      {
        name: 'French Polynesia',
        code: 'PF',
      },
      {
        name: 'French Southern Territories',
        code: 'TF',
      },
      {
        name: 'Gabon',
        code: 'GA',
      },
      {
        name: 'Gambia',
        code: 'GM',
      },
      {
        name: 'Georgia',
        code: 'GE',
      },
      {
        name: 'Germany',
        code: 'DE',
      },
      {
        name: 'Ghana',
        code: 'GH',
      },
      {
        name: 'Gibraltar',
        code: 'GI',
      },
      {
        name: 'Greece',
        code: 'GR',
      },
      {
        name: 'Greenland',
        code: 'GL',
      },
      {
        name: 'Grenada',
        code: 'GD',
      },
      {
        name: 'Guadeloupe',
        code: 'GP',
      },
      {
        name: 'Guam',
        code: 'GU',
      },
      {
        name: 'Guatemala',
        code: 'GT',
      },
      {
        name: 'Guernsey',
        code: 'GG',
      },
      {
        name: 'Guinea',
        code: 'GN',
      },
      {
        name: 'Guinea-Bissau',
        code: 'GW',
      },
      {
        name: 'Guyana',
        code: 'GY',
      },
      {
        name: 'Haiti',
        code: 'HT',
      },
      {
        name: 'Heard Island and Mcdonald Islands',
        code: 'HM',
      },
      {
        name: 'Holy See (Vatican City State)',
        code: 'VA',
      },
      {
        name: 'Honduras',
        code: 'HN',
      },
      {
        name: 'Hong Kong',
        code: 'HK',
      },
      {
        name: 'Hungary',
        code: 'HU',
      },
      {
        name: 'Iceland',
        code: 'IS',
      },
      {
        name: 'India',
        code: 'IN',
      },
      {
        name: 'Indonesia',
        code: 'ID',
      },
      {
        name: 'Iran, Islamic Republic Of',
        code: 'IR',
      },
      {
        name: 'Iraq',
        code: 'IQ',
      },
      {
        name: 'Ireland',
        code: 'IE',
      },
      {
        name: 'Isle of Man',
        code: 'IM',
      },
      {
        name: 'Israel',
        code: 'IL',
      },
      {
        name: 'Italy',
        code: 'IT',
      },
      {
        name: 'Jamaica',
        code: 'JM',
      },
      {
        name: 'Japan',
        code: 'JP',
      },
      {
        name: 'Jersey',
        code: 'JE',
      },
      {
        name: 'Jordan',
        code: 'JO',
      },
      {
        name: 'Kazakhstan',
        code: 'KZ',
      },
      {
        name: 'Kenya',
        code: 'KE',
      },
      {
        name: 'Kiribati',
        code: 'KI',
      },
      {
        name: 'Korea, Democratic People\'S Republic of',
        code: 'KP',
      },
      {
        name: 'Korea, Republic of',
        code: 'KR',
      },
      {
        name: 'Kuwait',
        code: 'KW',
      },
      {
        name: 'Kyrgyzstan',
        code: 'KG',
      },
      {
        name: 'Lao People\'S Democratic Republic',
        code: 'LA',
      },
      {
        name: 'Latvia',
        code: 'LV',
      },
      {
        name: 'Lebanon',
        code: 'LB',
      },
      {
        name: 'Lesotho',
        code: 'LS',
      },
      {
        name: 'Liberia',
        code: 'LR',
      },
      {
        name: 'Libyan Arab Jamahiriya',
        code: 'LY',
      },
      {
        name: 'Liechtenstein',
        code: 'LI',
      },
      {
        name: 'Lithuania',
        code: 'LT',
      },
      {
        name: 'Luxembourg',
        code: 'LU',
      },
      {
        name: 'Macao',
        code: 'MO',
      },
      {
        name: 'Macedonia, The Former Yugoslav Republic of',
        code: 'MK',
      },
      {
        name: 'Madagascar',
        code: 'MG',
      },
      {
        name: 'Malawi',
        code: 'MW',
      },
      {
        name: 'Malaysia',
        code: 'MY',
      },
      {
        name: 'Maldives',
        code: 'MV',
      },
      {
        name: 'Mali',
        code: 'ML',
      },
      {
        name: 'Malta',
        code: 'MT',
      },
      {
        name: 'Marshall Islands',
        code: 'MH',
      },
      {
        name: 'Martinique',
        code: 'MQ',
      },
      {
        name: 'Mauritania',
        code: 'MR',
      },
      {
        name: 'Mauritius',
        code: 'MU',
      },
      {
        name: 'Mayotte',
        code: 'YT',
      },
      {
        name: 'Mexico',
        code: 'MX',
      },
      {
        name: 'Micronesia, Federated States of',
        code: 'FM',
      },
      {
        name: 'Moldova, Republic of',
        code: 'MD',
      },
      {
        name: 'Monaco',
        code: 'MC',
      },
      {
        name: 'Mongolia',
        code: 'MN',
      },
      {
        name: 'Montserrat',
        code: 'MS',
      },
      {
        name: 'Morocco',
        code: 'MA',
      },
      {
        name: 'Mozambique',
        code: 'MZ',
      },
      {
        name: 'Myanmar',
        code: 'MM',
      },
      {
        name: 'Namibia',
        code: 'NA',
      },
      {
        name: 'Nauru',
        code: 'NR',
      },
      {
        name: 'Nepal',
        code: 'NP',
      },
      {
        name: 'Netherlands',
        code: 'NL',
      },
      {
        name: 'Netherlands Antilles',
        code: 'AN',
      },
      {
        name: 'New Caledonia',
        code: 'NC',
      },
      {
        name: 'New Zealand',
        code: 'NZ',
      },
      {
        name: 'Nicaragua',
        code: 'NI',
      },
      {
        name: 'Niger',
        code: 'NE',
      },
      {
        name: 'Nigeria',
        code: 'NG',
      },
      {
        name: 'Niue',
        code: 'NU',
      },
      {
        name: 'Norfolk Island',
        code: 'NF',
      },
      {
        name: 'Northern Mariana Islands',
        code: 'MP',
      },
      {
        name: 'Norway',
        code: 'NO',
      },
      {
        name: 'Oman',
        code: 'OM',
      },
      {
        name: 'Pakistan',
        code: 'PK',
      },
      {
        name: 'Palau',
        code: 'PW',
      },
      {
        name: 'Palestinian Territory, Occupied',
        code: 'PS',
      },
      {
        name: 'Panama',
        code: 'PA',
      },
      {
        name: 'Papua New Guinea',
        code: 'PG',
      },
      {
        name: 'Paraguay',
        code: 'PY',
      },
      {
        name: 'Peru',
        code: 'PE',
      },
      {
        name: 'Philippines',
        code: 'PH',
      },
      {
        name: 'Pitcairn',
        code: 'PN',
      },
      {
        name: 'Poland',
        code: 'PL',
      },
      {
        name: 'Portugal',
        code: 'PT',
      },
      {
        name: 'Puerto Rico',
        code: 'PR',
      },
      {
        name: 'Qatar',
        code: 'QA',
      },
      {
        name: 'Reunion',
        code: 'RE',
      },
      {
        name: 'Romania',
        code: 'RO',
      },
      {
        name: 'Russian Federation',
        code: 'RU',
      },
      {
        name: 'RWANDA',
        code: 'RW',
      },
      {
        name: 'Saint Helena',
        code: 'SH',
      },
      {
        name: 'Saint Kitts and Nevis',
        code: 'KN',
      },
      {
        name: 'Saint Lucia',
        code: 'LC',
      },
      {
        name: 'Saint Pierre and Miquelon',
        code: 'PM',
      },
      {
        name: 'Saint Vincent and the Grenadines',
        code: 'VC',
      },
      {
        name: 'Samoa',
        code: 'WS',
      },
      {
        name: 'San Marino',
        code: 'SM',
      },
      {
        name: 'Sao Tome and Principe',
        code: 'ST',
      },
      {
        name: 'Saudi Arabia',
        code: 'SA',
      },
      {
        name: 'Senegal',
        code: 'SN',
      },
      {
        name: 'Serbia and Montenegro',
        code: 'CS',
      },
      {
        name: 'Seychelles',
        code: 'SC',
      },
      {
        name: 'Sierra Leone',
        code: 'SL',
      },
      {
        name: 'Singapore',
        code: 'SG',
      },
      {
        name: 'Slovakia',
        code: 'SK',
      },
      {
        name: 'Slovenia',
        code: 'SI',
      },
      {
        name: 'Solomon Islands',
        code: 'SB',
      },
      {
        name: 'Somalia',
        code: 'SO',
      },
      {
        name: 'South Africa',
        code: 'ZA',
      },
      {
        name: 'South Georgia and the South Sandwich Islands',
        code: 'GS',
      },
      {
        name: 'Spain',
        code: 'ES',
      },
      {
        name: 'Sri Lanka',
        code: 'LK',
      },
      {
        name: 'Sudan',
        code: 'SD',
      },
      {
        name: 'Suriname',
        code: 'SR',
      },
      {
        name: 'Svalbard and Jan Mayen',
        code: 'SJ',
      },
      {
        name: 'Swaziland',
        code: 'SZ',
      },
      {
        name: 'Sweden',
        code: 'SE',
      },
      {
        name: 'Switzerland',
        code: 'CH',
      },
      {
        name: 'Syrian Arab Republic',
        code: 'SY',
      },
      {
        name: 'Taiwan, Province of China',
        code: 'TW',
      },
      {
        name: 'Tajikistan',
        code: 'TJ',
      },
      {
        name: 'Tanzania, United Republic of',
        code: 'TZ',
      },
      {
        name: 'Thailand',
        code: 'TH',
      },
      {
        name: 'Timor-Leste',
        code: 'TL',
      },
      {
        name: 'Togo',
        code: 'TG',
      },
      {
        name: 'Tokelau',
        code: 'TK',
      },
      {
        name: 'Tonga',
        code: 'TO',
      },
      {
        name: 'Trinidad and Tobago',
        code: 'TT',
      },
      {
        name: 'Tunisia',
        code: 'TN',
      },
      {
        name: 'Turkey',
        code: 'TR',
      },
      {
        name: 'Turkmenistan',
        code: 'TM',
      },
      {
        name: 'Turks and Caicos Islands',
        code: 'TC',
      },
      {
        name: 'Tuvalu',
        code: 'TV',
      },
      {
        name: 'Uganda',
        code: 'UG',
      },
      {
        name: 'Ukraine',
        code: 'UA',
      },
      {
        name: 'United Arab Emirates',
        code: 'AE',
      },
      {
        name: 'United Kingdom',
        code: 'GB',
      },
      {
        name: 'United States',
        code: 'US',
      },
      {
        name: 'United States Minor Outlying Islands',
        code: 'UM',
      },
      {
        name: 'Uruguay',
        code: 'UY',
      },
      {
        name: 'Uzbekistan',
        code: 'UZ',
      },
      {
        name: 'Vanuatu',
        code: 'VU',
      },
      {
        name: 'Venezuela',
        code: 'VE',
      },
      {
        name: 'Viet Nam',
        code: 'VN',
      },
      {
        name: 'Virgin Islands, British',
        code: 'VG',
      },
      {
        name: 'Virgin Islands, U.S.',
        code: 'VI',
      },
      {
        name: 'Wallis and Futuna',
        code: 'WF',
      },
      {
        name: 'Western Sahara',
        code: 'EH',
      },
      {
        name: 'Yemen',
        code: 'YE',
      },
      {
        name: 'Zambia',
        code: 'ZM',
      },
      {
        name: 'Zimbabwe',
        code: 'ZW',
      },
    ];

    /* src\widgets\Spinner.svelte generated by Svelte v3.18.1 */

    const file$7 = "src\\widgets\\Spinner.svelte";

    function create_fragment$9(ctx) {
    	let svg;
    	let circle;
    	let svg_class_value;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			circle = svg_element("circle");
    			attr_dev(circle, "class", "path svelte-9uz2hj");
    			attr_dev(circle, "cx", "25");
    			attr_dev(circle, "cy", "25");
    			attr_dev(circle, "r", "20");
    			attr_dev(circle, "fill", "none");
    			attr_dev(circle, "stroke-width", "5");
    			add_location(circle, file$7, 68, 2, 3406);
    			attr_dev(svg, "class", svg_class_value = "spinner stroke-current " + /*color*/ ctx[0] + " " + /*width*/ ctx[1] + " " + /*height*/ ctx[2] + " svelte-9uz2hj");
    			attr_dev(svg, "viewBox", "0 0 50 50");
    			add_location(svg, file$7, 67, 0, 3322);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, circle);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*color, width, height*/ 7 && svg_class_value !== (svg_class_value = "spinner stroke-current " + /*color*/ ctx[0] + " " + /*width*/ ctx[1] + " " + /*height*/ ctx[2] + " svelte-9uz2hj")) {
    				attr_dev(svg, "class", svg_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { color = "text-purple-500" } = $$props;
    	let { width = "w-8" } = $$props;
    	let { height = "h-8" } = $$props;
    	const writable_props = ["color", "width", "height"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Spinner> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("color" in $$props) $$invalidate(0, color = $$props.color);
    		if ("width" in $$props) $$invalidate(1, width = $$props.width);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    	};

    	$$self.$capture_state = () => {
    		return { color, width, height };
    	};

    	$$self.$inject_state = $$props => {
    		if ("color" in $$props) $$invalidate(0, color = $$props.color);
    		if ("width" in $$props) $$invalidate(1, width = $$props.width);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    	};

    	return [color, width, height];
    }

    class Spinner extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$9, safe_not_equal, { color: 0, width: 1, height: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Spinner",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get color() {
    		throw new Error("<Spinner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set color(value) {
    		throw new Error("<Spinner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Spinner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Spinner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Spinner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Spinner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\widgets\Progress.svelte generated by Svelte v3.18.1 */
    const file$8 = "src\\widgets\\Progress.svelte";

    function create_fragment$a(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let div0_class_value;
    	let div1_class_value;
    	let div2_class_value;

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", div0_class_value = "h-full w-1/2 absolute mdc-slider__track " + /*fillColor*/ ctx[1] + " move" + " svelte-sbma1v");
    			add_location(div0, file$8, 58, 4, 2396);
    			attr_dev(div1, "class", div1_class_value = "absolute w-full mdc-slider__track-container " + /*trackColor*/ ctx[0] + " " + /*height*/ ctx[2] + " svelte-sbma1v");
    			add_location(div1, file$8, 57, 2, 2312);
    			attr_dev(div2, "class", div2_class_value = "relative w-full " + /*height*/ ctx[2] + " block outline-none flex items-center" + " svelte-sbma1v");
    			add_location(div2, file$8, 55, 0, 2232);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*fillColor*/ 2 && div0_class_value !== (div0_class_value = "h-full w-1/2 absolute mdc-slider__track " + /*fillColor*/ ctx[1] + " move" + " svelte-sbma1v")) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*trackColor, height*/ 5 && div1_class_value !== (div1_class_value = "absolute w-full mdc-slider__track-container " + /*trackColor*/ ctx[0] + " " + /*height*/ ctx[2] + " svelte-sbma1v")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty & /*height*/ 4 && div2_class_value !== (div2_class_value = "relative w-full " + /*height*/ ctx[2] + " block outline-none flex items-center" + " svelte-sbma1v")) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { trackColor = "bg-red-200" } = $$props;
    	let { fillColor = "bg-blue-500" } = $$props;
    	let { height = "h-1" } = $$props;
    	const writable_props = ["trackColor", "fillColor", "height"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Progress> was created with unknown prop '${key}'`);
    	});

    	$$self.$set = $$props => {
    		if ("trackColor" in $$props) $$invalidate(0, trackColor = $$props.trackColor);
    		if ("fillColor" in $$props) $$invalidate(1, fillColor = $$props.fillColor);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    	};

    	$$self.$capture_state = () => {
    		return { trackColor, fillColor, height };
    	};

    	$$self.$inject_state = $$props => {
    		if ("trackColor" in $$props) $$invalidate(0, trackColor = $$props.trackColor);
    		if ("fillColor" in $$props) $$invalidate(1, fillColor = $$props.fillColor);
    		if ("height" in $$props) $$invalidate(2, height = $$props.height);
    	};

    	return [trackColor, fillColor, height];
    }

    class Progress extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$a, safe_not_equal, { trackColor: 0, fillColor: 1, height: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Progress",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get trackColor() {
    		throw new Error("<Progress>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set trackColor(value) {
    		throw new Error("<Progress>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fillColor() {
    		throw new Error("<Progress>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fillColor(value) {
    		throw new Error("<Progress>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get height() {
    		throw new Error("<Progress>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set height(value) {
    		throw new Error("<Progress>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.18.1 */

    const { console: console_1 } = globals;
    const file$9 = "src\\App.svelte";

    // (56:2) <NavigationDrawer bind:visible marginTop="mt-16">
    function create_default_slot_9(ctx) {
    	let div;
    	let h3;
    	let t1;
    	let ul;
    	let li0;
    	let t3;
    	let li1;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			h3 = element("h3");
    			h3.textContent = "Menu";
    			t1 = space();
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "Stock Analysis";
    			t3 = space();
    			li1 = element("li");
    			li1.textContent = "Subscriptions";
    			attr_dev(h3, "class", "font-medium px-6 pb-3 pt-4 tracking-wide text-gray-900");
    			add_location(h3, file$9, 57, 6, 1897);
    			attr_dev(li0, "class", "px-4 py-3 hover:bg-gray-200 text-gray-800 text-sm tracking-wide");
    			add_location(li0, file$9, 61, 8, 2022);
    			attr_dev(li1, "class", "px-4 py-3 hover:bg-gray-200 text-gray-800 text-sm tracking-wide");
    			add_location(li1, file$9, 65, 8, 2186);
    			attr_dev(ul, "class", "");
    			add_location(ul, file$9, 60, 6, 1999);
    			attr_dev(div, "class", "w-56 bg-red-100 h-full");
    			add_location(div, file$9, 56, 4, 1853);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h3);
    			append_dev(div, t1);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t3);
    			append_dev(ul, li1);

    			dispose = [
    				listen_dev(li0, "click", prevent_default(/*click_handler*/ ctx[10]), false, true, false),
    				listen_dev(li1, "click", prevent_default(/*click_handler_1*/ ctx[9]), false, true, false)
    			];
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(56:2) <NavigationDrawer bind:visible marginTop=\\\"mt-16\\\">",
    		ctx
    	});

    	return block;
    }

    // (75:4) <Button        text        textColor="text-gray-900"        on:click={() => (dialogVisible = !dialogVisible)}>
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Toggle");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(75:4) <Button        text        textColor=\\\"text-gray-900\\\"        on:click={() => (dialogVisible = !dialogVisible)}>",
    		ctx
    	});

    	return block;
    }

    // (83:2) <Button on:click={() => (sliderValue = 10)} bgColor="bg-purple-300">
    function create_default_slot_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Reset Slider Value");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(83:2) <Button on:click={() => (sliderValue = 10)} bgColor=\\\"bg-purple-300\\\">",
    		ctx
    	});

    	return block;
    }

    // (111:2) <Button textColor="text-white" bgColor="bg-orange-500">
    function create_default_slot_6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Normal Button");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(111:2) <Button textColor=\\\"text-white\\\" bgColor=\\\"bg-orange-500\\\">",
    		ctx
    	});

    	return block;
    }

    // (112:2) <Button      textColor="text-orange-500"      outlineColor="border-orange-500"      outlined      rounded>
    function create_default_slot_5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Normal Button");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(112:2) <Button      textColor=\\\"text-orange-500\\\"      outlineColor=\\\"border-orange-500\\\"      outlined      rounded>",
    		ctx
    	});

    	return block;
    }

    // (119:2) <Button textColor="text-orange-500" text>
    function create_default_slot_4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Normal Button");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(119:2) <Button textColor=\\\"text-orange-500\\\" text>",
    		ctx
    	});

    	return block;
    }

    // (135:2) <Button textColor="text-white" bgColor="bg-orange-500" rounded>
    function create_default_slot_3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Normal Button");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(135:2) <Button textColor=\\\"text-white\\\" bgColor=\\\"bg-orange-500\\\" rounded>",
    		ctx
    	});

    	return block;
    }

    // (161:8) <Button            on:click={() => (dialogVisible = false)}            outlined            outlineColor="border-green-600"            textColor="text-green-600">
    function create_default_slot_2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Close");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(161:8) <Button            on:click={() => (dialogVisible = false)}            outlined            outlineColor=\\\"border-green-600\\\"            textColor=\\\"text-green-600\\\">",
    		ctx
    	});

    	return block;
    }

    // (157:2) <Dialog bind:visible={dialogVisible} permanent>
    function create_default_slot_1(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let t1;
    	let current;

    	const button = new Button({
    			props: {
    				outlined: true,
    				outlineColor: "border-green-600",
    				textColor: "text-green-600",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler_5*/ ctx[21]);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			div0.textContent = "Huat lah!!!";
    			t1 = space();
    			create_component(button.$$.fragment);
    			attr_dev(div0, "class", "mb-4");
    			add_location(div0, file$9, 159, 8, 4772);
    			attr_dev(div1, "class", "flex flex-col");
    			add_location(div1, file$9, 158, 6, 4735);
    			attr_dev(div2, "class", "p-6 bg-gray-100 w-64 rounded");
    			add_location(div2, file$9, 157, 4, 4685);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div1, t1);
    			mount_component(button, div1, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 67108864) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(button);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(157:2) <Dialog bind:visible={dialogVisible} permanent>",
    		ctx
    	});

    	return block;
    }

    // (186:4) <Button textColor="text-white" bgColor="bg-orange-500" rounded>
    function create_default_slot(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Normal Button");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(186:4) <Button textColor=\\\"text-white\\\" bgColor=\\\"bg-orange-500\\\" rounded>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let t0;
    	let div1;
    	let div0;
    	let i;
    	let t2;
    	let span0;
    	let t4;
    	let span1;
    	let t6;
    	let div5;
    	let updating_visible;
    	let t7;
    	let div2;
    	let t8;
    	let t9;
    	let t10;
    	let t11;
    	let div3;
    	let input0;
    	let t12;
    	let input1;
    	let t13;
    	let updating_value;
    	let t14;
    	let t15;
    	let t16;
    	let t17;
    	let t18;
    	let updating_value_1;
    	let t19;
    	let h1;
    	let t20;

    	let t21_value = (/*countrySelected*/ ctx[1].name
    	? /*countrySelected*/ ctx[1].name
    	: "No country selected") + "";

    	let t21;
    	let t22;
    	let t23;
    	let t24;
    	let t25;
    	let t26;
    	let div4;
    	let t27;
    	let t28;
    	let t29;
    	let updating_value_2;
    	let t30;
    	let updating_value_3;
    	let t31;
    	let t32;
    	let t33;
    	let t34;
    	let t35;
    	let t36;
    	let updating_value_4;
    	let t37;
    	let updating_value_5;
    	let t38;
    	let updating_visible_1;
    	let t39;
    	let updating_value_6;
    	let t40;
    	let t41;
    	let t42;
    	let t43;
    	let t44;
    	let t45;
    	let updating_value_7;
    	let t46;
    	let updating_value_8;
    	let current;
    	let dispose;
    	const tailwindcss = new Tailwindcss({ $$inline: true });

    	function navigationdrawer_visible_binding(value) {
    		/*navigationdrawer_visible_binding*/ ctx[12].call(null, value);
    	}

    	let navigationdrawer_props = {
    		marginTop: "mt-16",
    		$$slots: { default: [create_default_slot_9] },
    		$$scope: { ctx }
    	};

    	if (/*visible*/ ctx[6] !== void 0) {
    		navigationdrawer_props.visible = /*visible*/ ctx[6];
    	}

    	const navigationdrawer = new NavigationDrawer({
    			props: navigationdrawer_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(navigationdrawer, "visible", navigationdrawer_visible_binding));
    	const spinner = new Spinner({ $$inline: true });

    	const button0 = new Button({
    			props: {
    				text: true,
    				textColor: "text-gray-900",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*click_handler_3*/ ctx[13]);
    	const progress = new Progress({ $$inline: true });

    	const button1 = new Button({
    			props: {
    				bgColor: "bg-purple-300",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button1.$on("click", /*click_handler_4*/ ctx[14]);

    	function slider0_value_binding(value_1) {
    		/*slider0_value_binding*/ ctx[15].call(null, value_1);
    	}

    	let slider0_props = {
    		min: 9,
    		max: 11,
    		thumbColor: "text-red-600",
    		trackEmptyColor: "bg-red-200",
    		trackFilledColor: "bg-red-600"
    	};

    	if (/*sliderValue*/ ctx[3] !== void 0) {
    		slider0_props.value = /*sliderValue*/ ctx[3];
    	}

    	const slider0 = new Slider({ props: slider0_props, $$inline: true });
    	binding_callbacks.push(() => bind(slider0, "value", slider0_value_binding));

    	function slider1_value_binding(value_2) {
    		/*slider1_value_binding*/ ctx[16].call(null, value_2);
    	}

    	let slider1_props = {
    		min: 9,
    		max: 11,
    		thumbColor: "text-red-600",
    		trackEmptyColor: "bg-red-200",
    		trackFilledColor: "bg-red-600"
    	};

    	if (/*sliderValue2*/ ctx[4] !== void 0) {
    		slider1_props.value = /*sliderValue2*/ ctx[4];
    	}

    	const slider1 = new Slider({ props: slider1_props, $$inline: true });
    	binding_callbacks.push(() => bind(slider1, "value", slider1_value_binding));

    	const button2 = new Button({
    			props: {
    				textColor: "text-white",
    				bgColor: "bg-orange-500",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button3 = new Button({
    			props: {
    				textColor: "text-orange-500",
    				outlineColor: "border-orange-500",
    				outlined: true,
    				rounded: true,
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const button4 = new Button({
    			props: {
    				textColor: "text-orange-500",
    				text: true,
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function autocomplete0_value_binding(value_3) {
    		/*autocomplete0_value_binding*/ ctx[17].call(null, value_3);
    	}

    	let autocomplete0_props = {
    		borderColor: "border-green-600",
    		labelColor: "text-red-700",
    		label: "Nameol",
    		items: /*fruits*/ ctx[8]
    	};

    	if (/*fruit*/ ctx[5] !== void 0) {
    		autocomplete0_props.value = /*fruit*/ ctx[5];
    	}

    	const autocomplete0 = new Autocomplete({
    			props: autocomplete0_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(autocomplete0, "value", autocomplete0_value_binding));

    	function input2_value_binding(value_4) {
    		/*input2_value_binding*/ ctx[18].call(null, value_4);
    	}

    	let input2_props = {
    		borderColor: "border-green-600",
    		labelColor: "text-red-700",
    		label: "Namewertyu uiou",
    		icon: "search",
    		helperText: /*error*/ ctx[2],
    		helperTextColor: "text-red-500"
    	};

    	if (/*name*/ ctx[0] !== void 0) {
    		input2_props.value = /*name*/ ctx[0];
    	}

    	const input2 = new Input({ props: input2_props, $$inline: true });
    	binding_callbacks.push(() => bind(input2, "value", input2_value_binding));

    	const button5 = new Button({
    			props: {
    				textColor: "text-white",
    				bgColor: "bg-orange-500",
    				rounded: true,
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function input3_value_binding(value_5) {
    		/*input3_value_binding*/ ctx[19].call(null, value_5);
    	}

    	let input3_props = {
    		outlined: true,
    		borderColor: "border-green-600",
    		labelColor: "text-red-700",
    		label: "Namewert",
    		icon: "search",
    		helperText: /*error*/ ctx[2],
    		helperTextColor: "text-red-500"
    	};

    	if (/*name*/ ctx[0] !== void 0) {
    		input3_props.value = /*name*/ ctx[0];
    	}

    	const input3 = new Input({ props: input3_props, $$inline: true });
    	binding_callbacks.push(() => bind(input3, "value", input3_value_binding));

    	function input4_value_binding(value_6) {
    		/*input4_value_binding*/ ctx[20].call(null, value_6);
    	}

    	let input4_props = {
    		outlined: true,
    		borderColor: "border-green-600",
    		labelColor: "text-red-700",
    		label: "Namewert Country here is very long",
    		icon: "search",
    		helperText: /*error*/ ctx[2],
    		helperTextColor: "text-red-500"
    	};

    	if (/*name*/ ctx[0] !== void 0) {
    		input4_props.value = /*name*/ ctx[0];
    	}

    	const input4 = new Input({ props: input4_props, $$inline: true });
    	binding_callbacks.push(() => bind(input4, "value", input4_value_binding));

    	function dialog_visible_binding(value_7) {
    		/*dialog_visible_binding*/ ctx[22].call(null, value_7);
    	}

    	let dialog_props = {
    		permanent: true,
    		$$slots: { default: [create_default_slot_1] },
    		$$scope: { ctx }
    	};

    	if (/*dialogVisible*/ ctx[7] !== void 0) {
    		dialog_props.visible = /*dialogVisible*/ ctx[7];
    	}

    	const dialog = new Dialog({ props: dialog_props, $$inline: true });
    	binding_callbacks.push(() => bind(dialog, "visible", dialog_visible_binding));

    	function autocomplete1_value_binding(value_8) {
    		/*autocomplete1_value_binding*/ ctx[23].call(null, value_8);
    	}

    	let autocomplete1_props = {
    		borderColor: "border-green-600",
    		labelColor: "text-red-700",
    		label: "Nameol",
    		items: countries,
    		keywordsFunction: func,
    		labelFieldName: "name",
    		minCharactersToSearch: 1,
    		outlined: true
    	};

    	if (/*countrySelected*/ ctx[1] !== void 0) {
    		autocomplete1_props.value = /*countrySelected*/ ctx[1];
    	}

    	const autocomplete1 = new Autocomplete({
    			props: autocomplete1_props,
    			$$inline: true
    		});

    	binding_callbacks.push(() => bind(autocomplete1, "value", autocomplete1_value_binding));
    	autocomplete1.$on("change", countryChanged);

    	const button6 = new Button({
    			props: {
    				textColor: "text-white",
    				bgColor: "bg-orange-500",
    				rounded: true,
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	function input5_value_binding(value_9) {
    		/*input5_value_binding*/ ctx[24].call(null, value_9);
    	}

    	let input5_props = {
    		outlined: true,
    		borderColor: "border-green-600",
    		labelColor: "text-red-700",
    		label: "b",
    		icon: "search",
    		helperText: /*error*/ ctx[2],
    		helperTextColor: "text-red-500"
    	};

    	if (/*name*/ ctx[0] !== void 0) {
    		input5_props.value = /*name*/ ctx[0];
    	}

    	const input5 = new Input({ props: input5_props, $$inline: true });
    	binding_callbacks.push(() => bind(input5, "value", input5_value_binding));

    	function input6_value_binding(value_10) {
    		/*input6_value_binding*/ ctx[25].call(null, value_10);
    	}

    	let input6_props = {
    		outlined: true,
    		borderColor: "border-green-600",
    		labelColor: "text-red-700",
    		label: "Name",
    		icon: "search",
    		helperText: /*error*/ ctx[2],
    		helperTextColor: "text-red-500"
    	};

    	if (/*name*/ ctx[0] !== void 0) {
    		input6_props.value = /*name*/ ctx[0];
    	}

    	const input6 = new Input({ props: input6_props, $$inline: true });
    	binding_callbacks.push(() => bind(input6, "value", input6_value_binding));

    	const block = {
    		c: function create() {
    			create_component(tailwindcss.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			div0 = element("div");
    			i = element("i");
    			i.textContent = "menu";
    			t2 = space();
    			span0 = element("span");
    			span0.textContent = "Time to Trade";
    			t4 = space();
    			span1 = element("span");
    			span1.textContent = "Tan Yin Loo";
    			t6 = space();
    			div5 = element("div");
    			create_component(navigationdrawer.$$.fragment);
    			t7 = space();
    			div2 = element("div");
    			create_component(spinner.$$.fragment);
    			t8 = space();
    			create_component(button0.$$.fragment);
    			t9 = space();
    			create_component(progress.$$.fragment);
    			t10 = space();
    			create_component(button1.$$.fragment);
    			t11 = space();
    			div3 = element("div");
    			input0 = element("input");
    			t12 = space();
    			input1 = element("input");
    			t13 = space();
    			create_component(slider0.$$.fragment);
    			t14 = space();
    			t15 = text(/*sliderValue*/ ctx[3]);
    			t16 = space();
    			t17 = text(/*sliderValue2*/ ctx[4]);
    			t18 = space();
    			create_component(slider1.$$.fragment);
    			t19 = space();
    			h1 = element("h1");
    			t20 = text("Hello ");
    			t21 = text(t21_value);
    			t22 = text("!");
    			t23 = space();
    			create_component(button2.$$.fragment);
    			t24 = space();
    			create_component(button3.$$.fragment);
    			t25 = space();
    			create_component(button4.$$.fragment);
    			t26 = space();
    			div4 = element("div");
    			t27 = text("fruit: ");
    			t28 = text(/*fruit*/ ctx[5]);
    			t29 = space();
    			create_component(autocomplete0.$$.fragment);
    			t30 = space();
    			create_component(input2.$$.fragment);
    			t31 = space();
    			create_component(button5.$$.fragment);
    			t32 = space();
    			t33 = text(/*name*/ ctx[0]);
    			t34 = space();
    			t35 = text(/*error*/ ctx[2]);
    			t36 = space();
    			create_component(input3.$$.fragment);
    			t37 = space();
    			create_component(input4.$$.fragment);
    			t38 = space();
    			create_component(dialog.$$.fragment);
    			t39 = space();
    			create_component(autocomplete1.$$.fragment);
    			t40 = space();
    			create_component(button6.$$.fragment);
    			t41 = space();
    			t42 = text(/*name*/ ctx[0]);
    			t43 = space();
    			t44 = text(/*error*/ ctx[2]);
    			t45 = space();
    			create_component(input5.$$.fragment);
    			t46 = space();
    			create_component(input6.$$.fragment);
    			attr_dev(i, "class", "material-icons text-gray-900 ml-6 cursor-pointer ripple");
    			add_location(i, file$9, 45, 4, 1441);
    			attr_dev(span0, "class", "ml-4 text-xl font-semibold text-gray-900");
    			add_location(span0, file$9, 50, 4, 1588);
    			attr_dev(div0, "class", "flex items-center");
    			add_location(div0, file$9, 44, 2, 1404);
    			attr_dev(span1, "class", "mr-6 text-lg uppercase text-gray-900");
    			add_location(span1, file$9, 52, 2, 1677);
    			attr_dev(div1, "class", "bg-pink-100 fixed left-0 right-0 top-0 h-16 mt-0 z-10 flex items-center\r\n  justify-between elevation-4");
    			add_location(div1, file$9, 41, 0, 1281);
    			attr_dev(div2, "class", "flex flex-row-reverse");
    			add_location(div2, file$9, 72, 2, 2391);
    			attr_dev(input0, "type", "range");
    			attr_dev(input0, "min", "9");
    			attr_dev(input0, "max", "20");
    			attr_dev(input0, "class", "w-full mb-5");
    			add_location(input0, file$9, 87, 4, 2738);
    			attr_dev(input1, "type", "range");
    			attr_dev(input1, "min", "9");
    			attr_dev(input1, "max", "20");
    			attr_dev(input1, "class", "w-full");
    			add_location(input1, file$9, 88, 4, 2801);
    			add_location(div3, file$9, 85, 2, 2725);
    			attr_dev(h1, "class", "svelte-1nsic7t");
    			add_location(h1, file$9, 107, 2, 3277);
    			add_location(div4, file$9, 119, 2, 3666);
    			attr_dev(div5, "class", "mb-5 mt-16 lg:px-32 px-4");
    			add_location(div5, file$9, 54, 0, 1756);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(tailwindcss, target, anchor);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, i);
    			append_dev(div0, t2);
    			append_dev(div0, span0);
    			append_dev(div1, t4);
    			append_dev(div1, span1);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div5, anchor);
    			mount_component(navigationdrawer, div5, null);
    			append_dev(div5, t7);
    			append_dev(div5, div2);
    			mount_component(spinner, div2, null);
    			append_dev(div2, t8);
    			mount_component(button0, div2, null);
    			append_dev(div5, t9);
    			mount_component(progress, div5, null);
    			append_dev(div5, t10);
    			mount_component(button1, div5, null);
    			append_dev(div5, t11);
    			append_dev(div5, div3);
    			append_dev(div3, input0);
    			append_dev(div3, t12);
    			append_dev(div3, input1);
    			append_dev(div3, t13);
    			mount_component(slider0, div3, null);
    			append_dev(div3, t14);
    			append_dev(div3, t15);
    			append_dev(div3, t16);
    			append_dev(div3, t17);
    			append_dev(div3, t18);
    			mount_component(slider1, div3, null);
    			append_dev(div5, t19);
    			append_dev(div5, h1);
    			append_dev(h1, t20);
    			append_dev(h1, t21);
    			append_dev(h1, t22);
    			append_dev(div5, t23);
    			mount_component(button2, div5, null);
    			append_dev(div5, t24);
    			mount_component(button3, div5, null);
    			append_dev(div5, t25);
    			mount_component(button4, div5, null);
    			append_dev(div5, t26);
    			append_dev(div5, div4);
    			append_dev(div4, t27);
    			append_dev(div4, t28);
    			append_dev(div5, t29);
    			mount_component(autocomplete0, div5, null);
    			append_dev(div5, t30);
    			mount_component(input2, div5, null);
    			append_dev(div5, t31);
    			mount_component(button5, div5, null);
    			append_dev(div5, t32);
    			append_dev(div5, t33);
    			append_dev(div5, t34);
    			append_dev(div5, t35);
    			append_dev(div5, t36);
    			mount_component(input3, div5, null);
    			append_dev(div5, t37);
    			mount_component(input4, div5, null);
    			append_dev(div5, t38);
    			mount_component(dialog, div5, null);
    			append_dev(div5, t39);
    			mount_component(autocomplete1, div5, null);
    			append_dev(div5, t40);
    			mount_component(button6, div5, null);
    			append_dev(div5, t41);
    			append_dev(div5, t42);
    			append_dev(div5, t43);
    			append_dev(div5, t44);
    			append_dev(div5, t45);
    			mount_component(input5, div5, null);
    			append_dev(div5, t46);
    			mount_component(input6, div5, null);
    			current = true;
    			dispose = listen_dev(i, "click", /*click_handler_2*/ ctx[11], false, false, false);
    		},
    		p: function update(ctx, [dirty]) {
    			const navigationdrawer_changes = {};

    			if (dirty & /*$$scope*/ 67108864) {
    				navigationdrawer_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_visible && dirty & /*visible*/ 64) {
    				updating_visible = true;
    				navigationdrawer_changes.visible = /*visible*/ ctx[6];
    				add_flush_callback(() => updating_visible = false);
    			}

    			navigationdrawer.$set(navigationdrawer_changes);
    			const button0_changes = {};

    			if (dirty & /*$$scope*/ 67108864) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);
    			const button1_changes = {};

    			if (dirty & /*$$scope*/ 67108864) {
    				button1_changes.$$scope = { dirty, ctx };
    			}

    			button1.$set(button1_changes);
    			const slider0_changes = {};

    			if (!updating_value && dirty & /*sliderValue*/ 8) {
    				updating_value = true;
    				slider0_changes.value = /*sliderValue*/ ctx[3];
    				add_flush_callback(() => updating_value = false);
    			}

    			slider0.$set(slider0_changes);
    			if (!current || dirty & /*sliderValue*/ 8) set_data_dev(t15, /*sliderValue*/ ctx[3]);
    			if (!current || dirty & /*sliderValue2*/ 16) set_data_dev(t17, /*sliderValue2*/ ctx[4]);
    			const slider1_changes = {};

    			if (!updating_value_1 && dirty & /*sliderValue2*/ 16) {
    				updating_value_1 = true;
    				slider1_changes.value = /*sliderValue2*/ ctx[4];
    				add_flush_callback(() => updating_value_1 = false);
    			}

    			slider1.$set(slider1_changes);

    			if ((!current || dirty & /*countrySelected*/ 2) && t21_value !== (t21_value = (/*countrySelected*/ ctx[1].name
    			? /*countrySelected*/ ctx[1].name
    			: "No country selected") + "")) set_data_dev(t21, t21_value);

    			const button2_changes = {};

    			if (dirty & /*$$scope*/ 67108864) {
    				button2_changes.$$scope = { dirty, ctx };
    			}

    			button2.$set(button2_changes);
    			const button3_changes = {};

    			if (dirty & /*$$scope*/ 67108864) {
    				button3_changes.$$scope = { dirty, ctx };
    			}

    			button3.$set(button3_changes);
    			const button4_changes = {};

    			if (dirty & /*$$scope*/ 67108864) {
    				button4_changes.$$scope = { dirty, ctx };
    			}

    			button4.$set(button4_changes);
    			if (!current || dirty & /*fruit*/ 32) set_data_dev(t28, /*fruit*/ ctx[5]);
    			const autocomplete0_changes = {};

    			if (!updating_value_2 && dirty & /*fruit*/ 32) {
    				updating_value_2 = true;
    				autocomplete0_changes.value = /*fruit*/ ctx[5];
    				add_flush_callback(() => updating_value_2 = false);
    			}

    			autocomplete0.$set(autocomplete0_changes);
    			const input2_changes = {};
    			if (dirty & /*error*/ 4) input2_changes.helperText = /*error*/ ctx[2];

    			if (!updating_value_3 && dirty & /*name*/ 1) {
    				updating_value_3 = true;
    				input2_changes.value = /*name*/ ctx[0];
    				add_flush_callback(() => updating_value_3 = false);
    			}

    			input2.$set(input2_changes);
    			const button5_changes = {};

    			if (dirty & /*$$scope*/ 67108864) {
    				button5_changes.$$scope = { dirty, ctx };
    			}

    			button5.$set(button5_changes);
    			if (!current || dirty & /*name*/ 1) set_data_dev(t33, /*name*/ ctx[0]);
    			if (!current || dirty & /*error*/ 4) set_data_dev(t35, /*error*/ ctx[2]);
    			const input3_changes = {};
    			if (dirty & /*error*/ 4) input3_changes.helperText = /*error*/ ctx[2];

    			if (!updating_value_4 && dirty & /*name*/ 1) {
    				updating_value_4 = true;
    				input3_changes.value = /*name*/ ctx[0];
    				add_flush_callback(() => updating_value_4 = false);
    			}

    			input3.$set(input3_changes);
    			const input4_changes = {};
    			if (dirty & /*error*/ 4) input4_changes.helperText = /*error*/ ctx[2];

    			if (!updating_value_5 && dirty & /*name*/ 1) {
    				updating_value_5 = true;
    				input4_changes.value = /*name*/ ctx[0];
    				add_flush_callback(() => updating_value_5 = false);
    			}

    			input4.$set(input4_changes);
    			const dialog_changes = {};

    			if (dirty & /*$$scope, dialogVisible*/ 67108992) {
    				dialog_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_visible_1 && dirty & /*dialogVisible*/ 128) {
    				updating_visible_1 = true;
    				dialog_changes.visible = /*dialogVisible*/ ctx[7];
    				add_flush_callback(() => updating_visible_1 = false);
    			}

    			dialog.$set(dialog_changes);
    			const autocomplete1_changes = {};

    			if (!updating_value_6 && dirty & /*countrySelected*/ 2) {
    				updating_value_6 = true;
    				autocomplete1_changes.value = /*countrySelected*/ ctx[1];
    				add_flush_callback(() => updating_value_6 = false);
    			}

    			autocomplete1.$set(autocomplete1_changes);
    			const button6_changes = {};

    			if (dirty & /*$$scope*/ 67108864) {
    				button6_changes.$$scope = { dirty, ctx };
    			}

    			button6.$set(button6_changes);
    			if (!current || dirty & /*name*/ 1) set_data_dev(t42, /*name*/ ctx[0]);
    			if (!current || dirty & /*error*/ 4) set_data_dev(t44, /*error*/ ctx[2]);
    			const input5_changes = {};
    			if (dirty & /*error*/ 4) input5_changes.helperText = /*error*/ ctx[2];

    			if (!updating_value_7 && dirty & /*name*/ 1) {
    				updating_value_7 = true;
    				input5_changes.value = /*name*/ ctx[0];
    				add_flush_callback(() => updating_value_7 = false);
    			}

    			input5.$set(input5_changes);
    			const input6_changes = {};
    			if (dirty & /*error*/ 4) input6_changes.helperText = /*error*/ ctx[2];

    			if (!updating_value_8 && dirty & /*name*/ 1) {
    				updating_value_8 = true;
    				input6_changes.value = /*name*/ ctx[0];
    				add_flush_callback(() => updating_value_8 = false);
    			}

    			input6.$set(input6_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tailwindcss.$$.fragment, local);
    			transition_in(navigationdrawer.$$.fragment, local);
    			transition_in(spinner.$$.fragment, local);
    			transition_in(button0.$$.fragment, local);
    			transition_in(progress.$$.fragment, local);
    			transition_in(button1.$$.fragment, local);
    			transition_in(slider0.$$.fragment, local);
    			transition_in(slider1.$$.fragment, local);
    			transition_in(button2.$$.fragment, local);
    			transition_in(button3.$$.fragment, local);
    			transition_in(button4.$$.fragment, local);
    			transition_in(autocomplete0.$$.fragment, local);
    			transition_in(input2.$$.fragment, local);
    			transition_in(button5.$$.fragment, local);
    			transition_in(input3.$$.fragment, local);
    			transition_in(input4.$$.fragment, local);
    			transition_in(dialog.$$.fragment, local);
    			transition_in(autocomplete1.$$.fragment, local);
    			transition_in(button6.$$.fragment, local);
    			transition_in(input5.$$.fragment, local);
    			transition_in(input6.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tailwindcss.$$.fragment, local);
    			transition_out(navigationdrawer.$$.fragment, local);
    			transition_out(spinner.$$.fragment, local);
    			transition_out(button0.$$.fragment, local);
    			transition_out(progress.$$.fragment, local);
    			transition_out(button1.$$.fragment, local);
    			transition_out(slider0.$$.fragment, local);
    			transition_out(slider1.$$.fragment, local);
    			transition_out(button2.$$.fragment, local);
    			transition_out(button3.$$.fragment, local);
    			transition_out(button4.$$.fragment, local);
    			transition_out(autocomplete0.$$.fragment, local);
    			transition_out(input2.$$.fragment, local);
    			transition_out(button5.$$.fragment, local);
    			transition_out(input3.$$.fragment, local);
    			transition_out(input4.$$.fragment, local);
    			transition_out(dialog.$$.fragment, local);
    			transition_out(autocomplete1.$$.fragment, local);
    			transition_out(button6.$$.fragment, local);
    			transition_out(input5.$$.fragment, local);
    			transition_out(input6.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tailwindcss, detaching);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div1);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div5);
    			destroy_component(navigationdrawer);
    			destroy_component(spinner);
    			destroy_component(button0);
    			destroy_component(progress);
    			destroy_component(button1);
    			destroy_component(slider0);
    			destroy_component(slider1);
    			destroy_component(button2);
    			destroy_component(button3);
    			destroy_component(button4);
    			destroy_component(autocomplete0);
    			destroy_component(input2);
    			destroy_component(button5);
    			destroy_component(input3);
    			destroy_component(input4);
    			destroy_component(dialog);
    			destroy_component(autocomplete1);
    			destroy_component(button6);
    			destroy_component(input5);
    			destroy_component(input6);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function countryChanged(item) {
    	console.log(item);
    }

    const func = it => `${it.name.toLowerCase()}|^|${it.code.toLowerCase()}`;

    function instance$a($$self, $$props, $$invalidate) {
    	let { name = "" } = $$props;
    	let countrySelected = {};
    	let error = "";
    	let sliderValue = 10;
    	let sliderValue2 = 10;
    	const fruits = ["APPLE", "ORANGE", "PEAR", "STRAWBERRY"];
    	let fruit = "";
    	let visible = false;
    	let dialogVisible = false;
    	const writable_props = ["name"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	function click_handler_1(event) {
    		bubble($$self, event);
    	}

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	const click_handler_2 = () => $$invalidate(6, visible = !visible);

    	function navigationdrawer_visible_binding(value) {
    		visible = value;
    		$$invalidate(6, visible);
    	}

    	const click_handler_3 = () => $$invalidate(7, dialogVisible = !dialogVisible);
    	const click_handler_4 = () => $$invalidate(3, sliderValue = 10);

    	function slider0_value_binding(value_1) {
    		sliderValue = value_1;
    		$$invalidate(3, sliderValue);
    	}

    	function slider1_value_binding(value_2) {
    		sliderValue2 = value_2;
    		$$invalidate(4, sliderValue2);
    	}

    	function autocomplete0_value_binding(value_3) {
    		fruit = value_3;
    		$$invalidate(5, fruit);
    	}

    	function input2_value_binding(value_4) {
    		name = value_4;
    		$$invalidate(0, name);
    	}

    	function input3_value_binding(value_5) {
    		name = value_5;
    		$$invalidate(0, name);
    	}

    	function input4_value_binding(value_6) {
    		name = value_6;
    		$$invalidate(0, name);
    	}

    	const click_handler_5 = () => $$invalidate(7, dialogVisible = false);

    	function dialog_visible_binding(value_7) {
    		dialogVisible = value_7;
    		$$invalidate(7, dialogVisible);
    	}

    	function autocomplete1_value_binding(value_8) {
    		countrySelected = value_8;
    		$$invalidate(1, countrySelected);
    	}

    	function input5_value_binding(value_9) {
    		name = value_9;
    		$$invalidate(0, name);
    	}

    	function input6_value_binding(value_10) {
    		name = value_10;
    		$$invalidate(0, name);
    	}

    	$$self.$set = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    	};

    	$$self.$capture_state = () => {
    		return {
    			name,
    			countrySelected,
    			error,
    			sliderValue,
    			sliderValue2,
    			fruit,
    			visible,
    			dialogVisible
    		};
    	};

    	$$self.$inject_state = $$props => {
    		if ("name" in $$props) $$invalidate(0, name = $$props.name);
    		if ("countrySelected" in $$props) $$invalidate(1, countrySelected = $$props.countrySelected);
    		if ("error" in $$props) $$invalidate(2, error = $$props.error);
    		if ("sliderValue" in $$props) $$invalidate(3, sliderValue = $$props.sliderValue);
    		if ("sliderValue2" in $$props) $$invalidate(4, sliderValue2 = $$props.sliderValue2);
    		if ("fruit" in $$props) $$invalidate(5, fruit = $$props.fruit);
    		if ("visible" in $$props) $$invalidate(6, visible = $$props.visible);
    		if ("dialogVisible" in $$props) $$invalidate(7, dialogVisible = $$props.dialogVisible);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*name*/ 1) {
    			 if (name.trim().length === 0) {
    				$$invalidate(2, error = "Please enter a name");
    			} else {
    				$$invalidate(2, error = "");
    			}
    		}
    	};

    	return [
    		name,
    		countrySelected,
    		error,
    		sliderValue,
    		sliderValue2,
    		fruit,
    		visible,
    		dialogVisible,
    		fruits,
    		click_handler_1,
    		click_handler,
    		click_handler_2,
    		navigationdrawer_visible_binding,
    		click_handler_3,
    		click_handler_4,
    		slider0_value_binding,
    		slider1_value_binding,
    		autocomplete0_value_binding,
    		input2_value_binding,
    		input3_value_binding,
    		input4_value_binding,
    		click_handler_5,
    		dialog_visible_binding,
    		autocomplete1_value_binding,
    		input5_value_binding,
    		input6_value_binding
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$b, safe_not_equal, { name: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get name() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set name(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: ''
    	}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
