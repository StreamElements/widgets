/*
1) Change keyXYZ value below to look like let keyXYZ="abc1234"
2) Change URL of img in HTML section if you want another heart beating
3) If you want to, buy me a beer at https://paypal.me/ThisIsLex
*/
let keyXYZ = false;
//SIZE MULTIPLIERS. 1 = 1 pixel
let bitsPoints = 1,
    followPoints = 1,
    hostPoints = 1, // how many % PER VIEWER
    subPoints = 5,
    donatePoints = 2, // multiplied by amount,
    amount = 0, //Initial grow
    limit = 80, // Percentage of containing box, so value 80 is for 80%
    explosionTime = 1200; //miliseconds
window.addEventListener('onEventReceived', function (obj) {
    if (keyXYZ) {
        const listener = obj.detail.listener;
        const data = obj.detail.event;
        if (listener === 'follower-latest') {

            announceAction(data["name"], 'follow', followPoints);
        } else if (listener === 'subscriber-latest') {
            announceAction(data["name"], 'sub', subPoints);
        } else if (listener === 'host-latest') {
            announceAction(data["name"], 'host', hostPoints * data["amount"]);
        } else if (listener === 'cheer-latest') {
            announceAction(data["name"], 'cheer', data["amount"] * bitsPoints);
        } else if (listener === 'tip-latest') {
            announceAction(data["name"], 'donation', data["amount"] * donatePoints);
        }
    }
});
window.addEventListener('onWidgetLoad', function (obj) {
    if (keyXYZ) {
        loadState();
    }
    else {
        $.post("https://api.keyvalue.xyz/new/StreamElements", function (data) {
            var parts = data.slice(1, -1).split("/");
            $("#label").html('SET keyXYZ value in your JS tab to "' + parts[3] + '"');
        });
    }
});

function announceAction(user, action, amount) {

    updateHeart(amount);
}

function updateHeart(amount) {

    let currentSize = (parseInt($("#image").css('width')) + amount) / parseInt($("#main-container").css('width')) * 100;
    if (currentSize > limit) currentSize = limit;
    $("#image").css('width', currentSize + '%');
    if (currentSize >= limit) {
        explode();
    }
    else {
        // You can add something you want to happen if there is no explosion after current action
    }
    saveState(currentSize);
}

function saveState(value) {
    $.post("https://api.keyvalue.xyz/" + keyXYZ + "/StreamElements/" + value, function (data) {
    });
}

function loadState() {
    $.get("https://api.keyvalue.xyz/" + keyXYZ + "/StreamElements", function (data) {
        $("#image").css('width', parseFloat(data) + '%');
    });
}

function explode() {
    $("#image").explodeRestore().removeClass('pulsate');

    setTimeout(function () {
        $("#image").explode({
            maxWidth: 15,
            minWidth: 5,
            radius: 231,
            release: false,
            recycle: true,
            explodeTime: explosionTime,
            canvas: true,
            round: false,
            maxAngle: 360,
            gravity: 0,
            groundDistance: 150,
        });
        setTimeout(function () {
            $("#image").css('width', '20px').addClass('pulsate');
        }, explosionTime + 3500);

    }, 300);

}

/*
 * jquery-image-explode 1.0.16
 * A jQuery explosion plugin.
 * https://github.com/blackmiaool/jquery-image-explode#readme
 *
 * Copyright 2015, blackmiaool
 * Released under the MIT license.
*/

"use strict";
var _typeof = "function" === typeof Symbol && "symbol" === typeof Symbol.iterator ? function (t) {
    return typeof t
} : function (t) {
    return t && "function" === typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
};
!function (t) {
    var a = "explode-wrapper";
    return t ? (t.fn.explodeRestore = function () {
        this.each(function () {
            var e = t(this), o = e.prop(a);
            o && (o.replaceWith(e), e.prop(a, null))
        })
    }, void(t.fn.explode = function (e) {
        function o(t, a) {
            console.warn("Unsupported " + t + " style:" + a[t])
        }

        function i(t) {
            function a() {
                var i = Date.now(), n = i - e;
                ct.clearRect(0, 0, at, et), rt.forEach(function (t) {
                    ct.save();
                    var a = t.width, e = t.height;
                    ct.translate(t.biasx, t.biasy), ct.rotate(t.lastAngle || t.finalAngleRad), j && (ct.beginPath(), ct.arc(0, 0, a / 2, 0, 2 * Math.PI, !1), ct.closePath(), ct.clip());
                    var i = void 0;
                    i = n < t.time1 ? 1 : n > t.time2 ? 0 : 1 - (n - t.time1) / I, 0 !== i || t.released || (t.released = !0, o--), ct.globalAlpha = i, ct.drawImage(dt[0], t.left, t.top, t.width, t.height, -a / 2, -e / 2, a, e), ct.restore()
                }), o ? window.requestAnimationFrame(a) : t && t()
            }

            var e = Date.now(), o = rt.length;
            rt.forEach(function (t) {
                t.time1 = 1e3 / (t.ratio * (_ + 1 - t.width) / _ + .1), t.time2 = t.time1 + I
            }), a()
        }

        function n() {
            setTimeout(function () {
                r(function () {
                    B.explodeRestore()
                }, !0)
            }, Y)
        }

        function r(t, a) {
            function e() {
                var r = Date.now(), s = void 0, d = void 0;
                if (s = (r - i) / 1e3, d = (r - o) / C, a && (d = 1 - d), W) At += W * s * 300; else {
                    if (d > 1 || d < 0) return void(t && t());
                    s *= Math.cos(d * Math.PI / 2) * Math.PI / 2
                }
                a && (s = -s), i = r, ct.clearRect(0, 0, at, et), rt.forEach(function (t) {
                    ct.save();
                    var a = t.width, e = t.height;
                    t.land || (t.biasx += t.vx * s, t.biasy += (t.vy + At) * s, W && (Q && Q(t) || t.biasy > t.transYMax || t.biasy < t.height / 2) && (n--, t.land = !0, t.lastAngle = t.finalAngleRad * d, N ? t.biasy = W > 0 ? t.transYMax : t.height / 2 : t.biasy = 2 * t.transYMax)), ct.translate(t.biasx, t.biasy), t.lastAngle ? ct.rotate(t.lastAngle) : ct.rotate(t.finalAngleRad * d), j && (ct.beginPath(), ct.arc(0, 0, a / 2, 0, 2 * Math.PI, !1), ct.closePath(), ct.clip()), ct.drawImage(dt[0], t.left, t.top, t.width, t.height, -a / 2, -e / 2, a, e), ct.restore()
                }), W && !n ? t() : window.requestAnimationFrame(e)
            }

            var o = Date.now(), i = o, n = rt.length;
            a || rt.forEach(function (t) {
                t.vx = t.translateX / C * 1e3, t.vy = t.translateY / C * 1e3, t.biasx = t.translateX0, t.biasy = t.translateY0, W && (t.transYMax = et / 2 + G - t.height / 2)
            }), e()
        }

        function s(t, a) {
            return parseInt(Math.random() * (a + 1 - t), 10) + t
        }

        function d(t) {
            for (var a = t.length, e = void 0, o = void 0; a;) o = Math.floor(Math.random() * a), a -= 1, e = t[a], t[a] = t[o], t[o] = e;
            return t
        }

        function c() {
            rt.forEach(function (t, a) {
                var e = (Math.random() * z * 2 - z) / ((Math.random() + 2) * t.width) * 10,
                    o = t.left + t.width / 2 - J / 2, i = t.top + t.width / 2 - K / 2;
                0 === o && (o = a % 2 ? -1 : 1), 0 === i && (i = a % 4 < 2 ? -1 : 1);
                var n = Math.sqrt(o * o + i * i), r = ((1 - nt) * (1 - (t.width - p) / (_ - p)) + nt) * Math.random();
                r = 1 - (1 - r) * (1 - y / b);
                var s = (b - n) * r + n, d = n * n, c = {
                    finalDistance: s,
                    ratio: r,
                    x: o,
                    y: i,
                    distance: n,
                    translateX: (s - n) * Math.sqrt((d - i * i) / d) * (o > 0 ? 1 : -1),
                    translateY: (s - n) * Math.sqrt((d - o * o) / d) * (i > 0 ? 1 : -1),
                    translateX0: (at - J) / 2 + t.left + t.width / 2,
                    translateY0: (et - K) / 2 + t.top + t.height / 2,
                    finalAngle: e,
                    finalAngleRad: e * (Math.PI / 180)
                };
                for (var h in c) t[h] = c[h]
            })
        }

        function h() {
            function t(t, a) {
                return !(t < tt[0] && a > K - tt[0] || t > J - tt[1] && a > K - tt[1] || t > J - tt[2] && a < tt[2] || t < tt[3] && a < tt[3])
            }

            function a(t, a, e, o, i) {
                return (t - e) * (t - e) + (a - o) * (a - o) < i * i
            }

            function e(e) {
                var o = e.left, i = e.top, s = e.width, d = e.height, h = o + s / 2, l = K - i - d / 2;
                (c || t(h, l) || tt.some(function (t, e) {
                    return a(h, l, n[e][0] * J + 2 * (.5 - n[e][0]) * t, n[e][1] * K + 2 * (.5 - n[e][1]) * t, t)
                })) && r.push({left: o, top: i, width: s, height: d})
            }

            function o(t) {
                function a(t) {
                    var a = o;
                    if (o += t, e({
                        left: a,
                        top: i,
                        width: t,
                        height: t
                    }), E) for (var n = 1; n < parseInt(_ / t); n++) e({left: a, top: i + n * t, width: t, height: t})
                }

                var o = 0, i = t * _, n = void 0;
                do n && a(n), n = s(p, _); while (J > o + n);
                J - o >= p && a(J - o)
            }

            var i = void 0, n = [[0, 1], [1, 1], [1, 0], [0, 0]];
            i = v ? Math.floor(K / _) : Math.ceil(K / _);
            for (var r = [], c = tt.every(function (t) {
                return 0 === t
            }), h = 0; h < i; h++) o(h);
            return d(r), r
        }

        function l() {
            var t = ["border-top-left-radius", "border-top-right-radius", "border-bottom-right-radius", "border-bottom-left-radius"],
                a = B.width();
            return t = t.map(function (t) {
                var e = B.css(t);
                return e.match(/px$/) ? 1 * e.match(/^\d+/)[0] : e.match(/%$/) ? e.match(/^\d+/)[0] / 100 * a : e
            }), t = t.map(function (t) {
                return t > a / 2 && (t = a / 2), t
            })
        }

        e && "object" === ("undefined" == typeof e ? "undefined" : _typeof(e)) || (e = {});
        var f = e, u = f.minWidth, p = void 0 === u ? 3 : u, g = f.omitLastLine, v = void 0 !== g && g, m = f.radius,
            b = void 0 === m ? 80 : m, w = f.minRadius, y = void 0 === w ? 0 : w, M = f.release, x = void 0 === M || M,
            k = f.fadeTime, I = void 0 === k ? 300 : k, A = f.recycle, P = void 0 === A || A, R = f.recycleDelay,
            Y = void 0 === R ? 500 : R, D = f.fill, E = void 0 === D || D, S = f.explodeTime,
            C = void 0 === S ? 300 : S, q = f.maxAngle, z = void 0 === q ? 360 : q, T = f.gravity,
            W = void 0 === T ? 0 : T, X = f.round, j = void 0 !== X && X, F = f.groundDistance,
            G = void 0 === F ? 400 : F, L = f.land, N = void 0 === L || L, Q = f.checkOutBound, Z = f.finish, $ = e,
            _ = $.maxWidth, B = this, H = void 0, O = arguments;
        if (B.length > 1) return void B.each(function () {
            var a = t(this);
            a.explode.apply(a, O)
        });
        if (B.length && t.contains(document, B[0])) {
            if ("IMG" === B.prop("tagName")) {
                if (!B.prop("complete")) return void B.on("load", function () {
                    B.explode.apply(B, O)
                });
                H = B
            } else if ("none" !== B.css("backgroundImage")) {
                var U = B.css("backgroundImage").match(/url\(\"([\S\s]*)\"\)/)[1];
                if (H = t("<img/>", {src: U}), !e.ignoreCompelete) return void H.on("load", function () {
                    e.ignoreCompelete = !0, B.explode.apply(B, [e])
                })
            }
            var J = B.width(), K = B.height(), V = Math.min(J, K), tt = l(), at = Math.max(J, 2 * b),
                et = Math.max(K, 2 * b, 2 * G);
            _ || (_ = V / 4);
            var ot = t("<div></div>", {class: a}),
                it = ["width", "height", "margin-top", "margin-right", "margin-bottom", "margin-left", "position", "top", "right", "bottom", "left", "float", "display"];
            it.forEach(function (t) {
                ot.css(t, B.css(t))
            }), "static" === ot.css("position") && ot.css("position", "relative");
            var nt = .3, rt = h();
            c();
            var st = t("<canvas></canvas>"), dt = t("<canvas></canvas>");
            dt.css({width: J, height: K}), dt.attr({width: J, height: K}), st.css({
                position: "absolute",
                left: (J - at) / 2,
                right: (J - at) / 2,
                top: (K - et) / 2,
                bottom: (K - et) / 2,
                margin: "auto",
                width: at,
                height: et
            }), st.attr({width: at, height: et}), ot.append(st);
            var ct = st[0].getContext("2d"), ht = dt[0].getContext("2d"), lt = H ? H[0] : {}, ft = lt.naturalWidth,
                ut = lt.naturalHeight;
            if ("IMG" === B.prop("tagName")) ht.drawImage(H[0], 0, 0, ft, ut, 0, 0, J, K); else if ("none" !== B.css("backgroundImage")) {
                var pt = 0, gt = 0, vt = ft, mt = ut, bt = {
                    "background-repeat": B.css("background-repeat"),
                    "background-size": B.css("background-size"),
                    "background-position-x": B.css("background-position-x"),
                    "background-position-y": B.css("background-position-y")
                }, wt = J / ft, yt = K / ut;
                if ("cover" === bt["background-size"]) {
                    var Mt = Math.max(wt, yt);
                    vt = ft * Mt, mt = ut * Mt
                } else if ("contain" === bt["background-size"]) {
                    var xt = Math.min(wt, yt);
                    vt = ft * xt, mt = ut * xt
                } else o("background-size", bt);
                if (pt = parseInt(bt["background-position-x"]) / 100 * (J - vt), gt = parseInt(bt["background-position-y"]) / 100 * (K - mt), "repeat" === bt["background-repeat"]) for (var kt = 0 - Math.ceil(pt / vt); kt < J / vt + Math.ceil(-pt / vt); kt++) for (var It = 0 - Math.ceil(gt / mt); It < K / mt + Math.ceil(-gt / mt); It++) ht.drawImage(H[0], 0, 0, ft, ut, pt + kt * vt, gt + It * mt, vt, mt); else "no-repeat" === bt["background-repeat"] ? ht.drawImage(H[0], 0, 0, ft, ut, pt, gt, vt, mt) : o("background-repeat", bt)
            } else "rgba(0, 0, 0, 0)" !== B.css("backgroundColor") ? (ht.fillStyle = B.css("backgroundColor"), ht.fillRect(0, 0, J, K)) : console.warn("There's nothing to explode.");
            rt.forEach(function (t) {
                var a = t.left, e = t.top, o = t.width, i = t.height;
                t.naturalParams = [a, e, o, i]
            }), B.after(ot), B.prop(a, ot), B.detach();
            var At = 0;
            r(function () {
                x ? i() : P ? n() : Z && Z()
            })
        }
    })) : void console.error("jQuery or Zepto is needed.")
}(window.jQuery || window.Zepto);