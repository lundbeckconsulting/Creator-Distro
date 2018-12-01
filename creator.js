"use strict";

$(document).ready(function () {
    var $media = $("#lc-common-media");
    var $modalBlack;
    var modalWild = "[class^='modal']",
        modalWildVisible = modalWild + ":visible";

    (function Init() {
        InitModal();
    })();

    $media.on("resize", function (event, sizeInt, size, orientation) {});

    $(".c-content-details").find("div.link-wrap > input.link").click(function () {
        var $wrap = this.closest(".c-content-details");

        $(this).slideUp("fast", function () {
            $(this).removeClass("virgin");
            $($wrap).find("div.main-wrap").slideDown("slow");
        });
    });

    function InitModal() {
        if ($(modalWild).length > 0) {
            var $elm = document.createElement("div");
            $elm.id = CREATOR.Const.ModalBlackoutName;

            $("body").prepend($elm);

            $modalBlack = $("#" + CREATOR.Const.ModalBlackoutName);
        }
    }

    $(".show-modal").click(function (event) {
        var idModal = $(this).data("modal-id");
        var id = -1;

        if ($(this).data("id") !== null) {
            id = parseInt($(this).data("id"));
        }

        event.preventDefault();

        $modalBlack.fadeIn("slow", function () {
            $("#" + idModal).fadeIn("fast", function () {
                $("#" + idModal).trigger("modal:show", [{ id: id }]);               
            });
        });
    });

    $(".close-modal").click(function (event) {
        console.log("close-modal");

        event.preventDefault();

        CloseAllModals();
    });

    $("#" + CREATOR.Const.ModalBlackoutName).click(function () {
        CloseAllModals();
    });

    $(document).keyup(function (key) {
        if (key.keyCode === 27) {
            if ($modalBlack.is(":visible")) {
                CloseAllModals();
            }
        }
    });

    function CloseModal($modal) {
        var callback = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

        $($modal).fadeOut("fast", function () {
            $($modal).trigger("modal:close");

            if ($(modalWildVisible).length == 0) {
                $modalBlack.fadeOut("slow", function () {
                    fireCallback();
                });
            } else {
                fireCallback();
            }

            function fireCallback() {
                if (callback != null) {
                    callback();
                }
            }
        });
    }

    function CloseAllModals() {
        var $modals = $(modalWildVisible);

        $.each($modals, function (key, value) {
            CloseModal(this);
        });
    }
});


"use strict";

$(document).ready(function () {
    var resizeTimer;
    var $media = $("#creator-media");
    var $mediaOrientation = $("#creator-media-orientation");

    (function Init() {
        InitRows();
        InitMedia();
    })();

    $(window).on('resize', function (e) {
        HandleResize();
    });

    function InitMedia() {
        $media.data("base", $media.css("z-index"));
        $mediaOrientation.data("base", $media.css("z-index"));

        HandleResize(true);
    };

    function InitRows() {
        $.each($(".row"), function (i) {
            var $row = $(this);
            var $cols = $row.find("div[class^='col']");
            var $container = $("<div></div>").attr("row-id", i).addClass("row-container");

            $row.attr("id", i);

            $cols.each(function (ii) {
                var $col = $(this);

                $($col).addClass("r");

                $col.attr("id", ii);
                $col.attr("row", i);

                if (!$col.hasClass("col")) {
                    $($col).detach();
                    $($col).appendTo($container);
                }
            });

            $row.after($container);
        });
    };

    function HandleResize() {
        var forceTrigger = arguments.length <= 0 || arguments[0] === undefined ? false : arguments[0];

        clearTimeout(resizeTimer);

        resizeTimer = setTimeout(function () {
            var runTrigger = false;

            if ($media.data("base") !== $media.css("z-index")) {
                $media.data("base", $media.css("z-index"));

                runTrigger = true;
            }

            if ($mediaOrientation.data("base") !== $mediaOrientation.css("z-index")) {
                $mediaOrientation.data("base", $mediaOrientation.css("z-index"));

                runTrigger = true;
            }

            if (runTrigger || forceTrigger) {
                var sizeInt = $media.css("z-index");
                var size = "xs";
                var orientation = "landscape";

                switch (parseInt($media.css("z-index"))) {
                    case 1:
                        size = "sm";
                        break;

                    case 2:
                        size = "md";
                        break;

                    case 3:
                        size = "lg";
                        break;

                    case 4:
                        size = "xl";
                        break;
                }

                switch ($mediaOrientation.css("z-index")) {
                    case 1:
                        orientation = "portrait";
                        break;

                    case 2:
                        orientation = "landscape";
                        break;
                }

                HandleRows(size);

                $media.trigger("resize", [sizeInt, size, orientation]);
            }
        }, 250);
    }

    function HandleRows(size) {
        $.each($(".row"), function (index) {
            var $row = $(this);
            var rowId = parseInt($row.attr("id"));
            var sizeList = [],
                downSizeList = [];

            switch (size.toUpperCase()) {
                case "XS":
                    sizeList = ["XS"];
                    downSizeList = ["SM", "MD", "LG", "XL"];
                    break;

                case "SM":
                    sizeList = ["XS", "SM"];
                    downSizeList = ["MD", "LG", "XL"];
                    break;

                case "MD":
                    sizeList = ["XS", "SM", "MD"];
                    downSizeList = ["LG", "XL"];
                    break;

                case "LG":
                    sizeList = ["XS", "SM", "MD", "LG"];
                    downSizeList = ["XL"];
                    break;

                case "XL":
                    sizeList = ["XS", "SM", "MD", "LG", "XL"];
                    break;
            }

            $.each(downSizeList, function (i, val) {
                $.each($row.find("div[class^='col-" + val.toLowerCase() + "']"), function (ii) {
                    var $col = $(this);
                    var $container = $("div.row-container[row-id='" + rowId + "']");

                    $col.addClass("r");

                    $col.detach();
                    $container.append($col);
                });
            });

            $.each(sizeList, function (i, val) {
                $.each($("div.row-container"), function (i) {
                    var $container = $(this);
                    var $r = $(".row[id='" + $container.attr("row-id") + "']");

                    $.each($container.find("div[class^='col-" + val.toLowerCase() + "']"), function (ii) {
                        var $col = $(this);

                        $col.removeClass("r");

                        $col.detach();
                        $r.append($col);
                    });
                });
            });

            $(".row[id='" + rowId + "'] div[class^='col']").sort(function (a, b) {
                a = Number($(a).attr("id"));
                b = Number($(b).attr("id"));

                return a - b;
            }).appendTo(".row[id='" + rowId + "']");
        });
    }
});


"use strict";

var CREATOR = {
    PUB: {
        DateTime: {
            Current: {
                date: function date() {
                    return new Date();
                },
                time: function time() {
                    return CREATOR.PUB.DateTime.Current.date().getTime();
                },
                long: function long() {
                    return CREATOR.PUB.DateTime.toLongDate(CREATOR.DateTime.date());
                },
                short: function short() {
                    return CREATOR.PUB.DateTime.toShortDate(CREATOR.DateTime.date());
                }
            },
            toLongDate: function toLongDate(date) {
                var result = CREATOR.PUB.DateTime.toShortDate(date) + " " + date.getUTCHours() + ":" + date.getUTCMinutes() + "." + date.getUTCSeconds();

                return result;
            },
            toShortDate: function toShortDate(date) {
                var result = date.getUTCDay() + "." + (date.getUTCMonth() + 1) + "." + date.getUTCFullYear();

                return result;
            },
            subtractDays: function subtractDays(days) {
                var result = CREATOR.PUB.DateTime.Current.date;

                result.setDate(result.getDate() - days);

                return result;
            }
        },
        Common: {
            siteId: function siteId() {
                var result = $("#lc-common-site-id").val();

                return parseInt(result);
            },
            appId: function appId(callback) {
                if (CREATOR.PUB.Common.siteId() > 0) {
                    CREATOR.Ajax.Invoke(null, "Site", "GetSite", { "id": CREATOR.PUB.Common.siteId() }, null, "GET", function (result) {
                        if (!CREATOR.PUB.State.isEmpty(callback)) {
                            callback(result.id);
                        }
                    });
                }
            },
            isDevelopment: function isDevelopment() {
                var result = -1;
                var $elm = $("#lc-common-is-development");

                if (!CREATOR.PUB.State.isEmpty($elm)) {
                    if ($.isNumeric($elm.val())) {
                        result = parseInt($elm.val());
                    }
                }

                return CREATOR.PUB.Cast.toBool(result);
            },
            creds: function creds(callback) {
                var url = "/SECURE/creds.json";

                if (CREATOR.PUB.Utility.fileExists(url)) {
                    CREATOR.API.Ajax.GetJSON(url, success);
                } else {
                    CREATOR.PUB.Utility.Console.error("creds.json doesn't exists. \"" + url + "\"");
                }

                function success(data) {
                    callback(data);
                }
            }
        },
        Utility: {
            fileExists: function fileExists(url) {
                var result = false;
                var xhr = new XMLHttpRequest();
                xhr.open('HEAD', url, false);
                xhr.send();

                if (xhr.status !== 404) {
                    result = true;
                }

                xhr = null;

                return result;
            },
            Console: {
                basic: function basic(content) {
                    if (CREATOR.PUB.Common.isDevelopment()) {
                        console.log(content);
                    }
                },
                error: function error(content) {
                    if (CREATOR.PUB.Common.isDevelopment()) {
                        console.error(content);
                    }
                }
            },
            Log: {
                warning: function warning(content) {},
                dbLog: function dbLog(content) {}
            }
        },
        State: {
            isEmpty: function isEmpty(val) {
                var result = true;

                if (typeof val !== "undefined" && val !== null) {
                    result = val.length === 0;
                }

                return result;
            },
            isEqual: function isEqual(val1, val2) {
                return val1 === val2;
            },
            isEmail: function isEmail(email) {
                var result = false;
                var reg = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

                if (reg.test(email)) {
                    result = true;
                }

                return result;
            },
            isURL: function isURL(url) {
                var result = false;
                var reg = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/;

                if (reg.test(url)) {
                    result = true;
                }

                return result;
            },
            isBool: function isBool(val) {
                var result = false;

                switch (val.toLowerCase()) {
                    case "true":
                    case "false":
                    case "1":
                    case "0":
                        result = true;
                        break;
                }

                return result;
            }
        },
        Math: {
            roundUp: function roundUp(val) {
                var result = this;
                var separator = undefined;

                if (!$.isNumeric(val)) {
                    CREATOR.PUB.Utility.Console.error("RoundUp", "Supplied value \"" + val + "\" not numeric");
                } else {
                    if (val.indexOf(".") > 0) {
                        separator = ".";
                    } else if (val.indexOf(",") > 0) {
                        separator = ",";
                    }

                    if (!separator.IsNull()) {
                        var tmp1 = undefined,
                            tmp2 = undefined;

                        tmp1 = parseInt(val.substring(0, val.indexOf(separator)));
                        tmp2 = parseInt(val.substring(val.indexOf(separator)));

                        if (tmp >= 50) {
                            result = tmp1 + 1;
                        }
                    }
                }

                return result;
            }
        },
        Cast: {
            toBool: function toBool(val) {
                var result = false;

                switch (String(val).toLowerCase()) {
                    case "true":
                    case "1":
                        result = true;
                        break;
                }

                return result;
            },
            toCapitalCase: function toCapitalCase(val) {
                var result = undefined;

                if (!LC.PUB.State.isEmpty(val)) {
                    result = val.substring(0, 1).toUpperCase() + val.substring(1);
                }

                return result;
            },
            toCamelCase: function toCamelCase(val) {
                var result = undefined;
                var vals = val.Split(" ");
                var i = 0;

                $.each(vals, function (val) {
                    var word = CREATOR.PUB.State.toCapitalCase(val);

                    result += i === 0 ? word : " " + word;

                    i++;
                });

                return result;
            },
            toCamelCaseMerged: function toCamelCaseMerged(val) {
                return CREATOR.PUB.Cast.ToCamelCase(val).replace(" ", "");
            }
        },
        Cookie: {
            Get: function Get(name) {
                return Cookies.Get(name);
            },
            Set: function Set(name, value) {
                var expire = arguments.length <= 2 || arguments[2] === undefined ? 180 : arguments[2];

                Cookies.Set(name, value, { expires: expire, path: "" });
            },
            Delete: function Delete(name) {
                Cookies.Remove(name, { expires: -1, path: "" });
            },
            DeleteAll: function DeleteAll() {
                var cookies = [];

                var i = 1;

                $.each(Cookies.get(), function (cookie) {
                    var name = cookie.name;

                    CREATOR.PUB.Utility.Console.basic("Processing " + name);

                    CREATOR.PUB.Cookie.Delete(name);
                    result.push(name);

                    i++;
                });

                CREATOR.PUB.Utility.Console.basic(i + " cookies deleted");
            }
        }
    },
    Ajax: {
        Invoke: function Invoke() {
            var host = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];
            var controller = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
            var action = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];
            var query = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];
            var data = arguments.length <= 4 || arguments[4] === undefined ? {} : arguments[4];
            var type = arguments.length <= 5 || arguments[5] === undefined ? "GET" : arguments[5];
            var callback = arguments.length <= 6 || arguments[6] === undefined ? null : arguments[6];

            var url = CREATOR.Ajax.GetUrl(host, controller, action, query);
            var timeStart = new Date();

            $.ajax({
                type: type.toUpperCase(),
                url: url,
                data: JSON.stringify(data),
                dataType: "JSON",
                contentType: "application/json",
                success: function success(result) {
                    CREATOR.PUB.Utility.Console.basic({ duration: (new Date() - timeStart) / 1000, url: url, data: data });

                    if (!CREATOR.PUB.State.isEmpty(callback)) {
                        callback(result);
                    }
                },
                error: function error(xhr, status, _error) {
                    CREATOR.PUB.Utility.Console.error({ error: _error });
                    CREATOR.PUB.Utility.Console.error({ status: status });
                    CREATOR.PUB.Utility.Console.error({ xhr: xhr });
                }
            });
        },
        GetJSON: function GetJSON(host, controller, action, query, callback) {
            if (host === undefined) host = null;
            if (controller === undefined) controller = null;
            if (action === undefined) action = null;
            if (query === undefined) query = {};

            $.getJSON(CREATOR.Ajax.GetUrl(host, controller, action, query), success);

            function success(data) {
                callback(data);
            }
        },
        GetUrl: function GetUrl(host, controller, action) {
            var query = arguments.length <= 3 || arguments[3] === undefined ? {} : arguments[3];

            var result = "";

            if (!CREATOR.PUB.State.isEmpty(host)) {
                result = host;
            }

            if (!CREATOR.PUB.State.isEmpty(controller)) {
                result += "/" + controller;
            }

            if (!CREATOR.PUB.State.isEmpty(action)) {
                result += "/" + action;
            }

            var tmp = undefined;
            var i = 0;

            $.each(query, function (key, value) {
                if (i === 0) {
                    tmp = "?";
                } else {
                    tmp += "&";
                }

                tmp += key + "=" + value;

                i++;
            });

            if (!CREATOR.PUB.State.isEmpty(tmp)) {
                result += tmp;
            }

            return result.toLowerCase();
        }
    },
    Const: {
        ModalBlackoutName: "modalBlackout"
    }
};

(function ($) {
    $.fn.ToBool = function () {
        var result = CREATOR.PUB.Cast.toBool(this.val());

        return result;
    };

    $.fn.IsNumeric = function () {
        return $.isNumeric(this.val());
    };

    $.fn.IsEqual = function (val) {
        return CREATOR.PUB.State.isEqual(val, this.val());
    };

    $.fn.IsBool = function () {
        return CREATOR.PUB.State.isBool(this.val());
    };

    $.fn.IsEmail = function () {
        return CREATOR.PUB.State.isEmail(this.val());
    };

    $.fn.IsEmailAsInt = function () {
        var result = 0;

        if (this.IsEmail()) {
            result = 1;
        }

        return result;
    };

    $.fn.IsURL = function () {
        return CREATOR.PUB.State.isURL(this.val());
    };

    $.fn.IsURLAsInt = function () {
        var result = 0;

        if (this.IsURL()) {
            result = 1;
        }

        return result;
    };

    $.fn.IsEmpty = function () {
        var result = CREATOR.PUB.State.isEmpty(this.val());

        return result;
    };

    $.fn.ToCapitalCase = function () {
        return CREATOR.Cast.toCapitalCase(this.val());
    };

    $.fn.ToCamelCase = function () {
        return CREATOR.PUB.Cast.toCamelCase(this.val());
    };

    $.fn.ToCamelCaseMerged = function () {
        return CREATOR.PUB.Cast.toCamelCaseMerged(this.val());
    };

    $.fn.StartsWith = function (str) {
        return this.val().startsWith(str);
    };

    $.fn.EndsWith = function (str) {
        return this.val().endsWith(str);
    };

    $.fn.SetCookie = function (name) {
        var expires = arguments.length <= 1 || arguments[1] === undefined ? 180 : arguments[1];

        CREATOR.PUB.Cookie.Set(name, this.val(), expires);
    };
})(jQuery);