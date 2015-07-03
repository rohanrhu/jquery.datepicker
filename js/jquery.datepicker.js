/*
 * https://github.com/rohanrhu/jquery.datepicker
 * Copyright (C) 2014, Oğuzhan Eroğlu <rohanrhu2@gmail.com>
 * Licensed under MIT
 */

// ----------------------------------------

var jQueryDatepicker = function (parameters) {
    var t_jQueryDatepicker = this;

    t_jQueryDatepicker.$element = parameters.$element;
    t_jQueryDatepicker.parameters = parameters;

    t_jQueryDatepicker.initialize = function () {
        t_jQueryDatepicker.$element.each(function () {
            var $datepicker = $(this);

            var date_now;
            var date_selected;

            var current_date = new Date();
            var current_year = current_date.getFullYear();
            var current_month = current_date.getMonth()+1;
            var current_day = current_date.getDate();

            var calendar_current_year;
            var calendar_current_month;
            var calendar_current_day;
            var calendar_current_weekday;

            var calendar_current_year_other;
            var calendar_current_month_other;
            var calendar_current_day_other;
            var calendar_current_weekday_other;

            var selected_date;
            var selected_year;
            var selected_month;
            var selected_day;
            var selected_dayofweek;

            var $label_year = $datepicker.find('.datepicker_1_label_year');
            var $label_month = $datepicker.find('.datepicker_1_label_month');

            var $calendar = $datepicker.find('.datepicker_1_calendar_1');
            var $months = $datepicker.find('.datepicker_1_calendar_1_months');
            var $month_proto = $datepicker.find('.datepicker_1_calendar_1_months_month.datepicker_1__proto');
            var $weekday_proto = $datepicker.find('.datepicker_1_calendar_1_months_month_weekdays_weekday.datepicker_1__proto');

            var $current_month;
            var $current_day;

            $datepicker.on('initialize.datepicker', function (event) {
                calendar_current_year = current_year;
                calendar_current_month = current_month;
                calendar_current_day = 0;

                $datepicker.trigger('select_year.datepicker', {year: calendar_current_year});
                $datepicker.trigger('select_month.datepicker', {month: calendar_current_month});
            });

            $datepicker.on('select_year.datepicker', function (event, params) {
                params.year = parseInt(params.year);

                calendar_current_year = params.year;

                $datepicker.find('.datepicker_1_calendar_1_months_month').not('.datepicker_1__proto').remove();

                var $_month;
                for (var _month=1; _month <= 12; _month++) {
                    $_month = $month_proto.clone(true);
                    $_month.removeClass('datepicker_1__proto');
                    var $_month_weekdays = $_month.find('.datepicker_1_calendar_1_months_month_weekdays');
                    var $_month_weekday;

                    var _month_date = new Date(calendar_current_year, _month);

                    var _day_count = new Date(calendar_current_year, _month, 0).getDate();

                    var _weekday_days = {};
                    for (var _weekday=1; _weekday <= 7; _weekday++) {
                        _weekday_days[_weekday] = {
                            days: [],
                            indicator: 0
                        };
                    }

                    var indicator = 0;

                    for (var _day=1; _day <= _day_count; _day++) {
                        var _day_date = new Date(calendar_current_year, _month-1, _day-1);
                        var _day_weekday = _day_date.getDay()+1;
                        var _weekdays = _weekday_days[_day_weekday];

                        _weekdays.indicator = indicator;

                        _weekdays.days[_weekdays.indicator++] = _day;

                        if (_day_weekday == 7) {
                            indicator++;
                        }
                    }

                    for (_weekday=1; _weekday <= 7; _weekday++) {
                        $_month_weekday = $weekday_proto.clone(true);
                        $_month_weekday.removeClass('datepicker_1__proto');
                        var $_month_weekday_title = $_month_weekday.find('.datepicker_1_calendar_1_months_month_weekdays_weekday_title');
                        var $_month_weekday_days = $_month_weekday.find('.datepicker_1_calendar_1_months_month_weekdays_weekday_days');
                        var $_day_proto = $_month_weekday_days.find('.datepicker_1_calendar_1_months_month_weekdays_weekday_days_day.datepicker_1__proto');
                        var $_day;

                        var _day_name = jQueryDatepicker.day_names_short[_weekday];
                        
                        $_month_weekday_title.html(_day_name);

                        var _days = _weekday_days[_weekday];
                        var _day;
                        for (var i=0; i < _days.days.length; i++) {
                            _day = _days.days[i];
                            $_day = $_day_proto.clone(true);
                            $_day.removeClass('datepicker_1__proto');

                            $_day.attr({
                                day: _day
                            });

                            $_day.addClass('datepicker_1_calendar_1_months_month_weekdays_weekday_days_day-day-'+_day);

                            if (
                                (calendar_current_year == selected_year) &&
                                (_month == selected_month) &&
                                (_day == selected_day)
                            ) {
                                $_day.addClass('__current');
                            }

                            if (_day == undefined) {
                                $_day.addClass('__previous_month');
                            } else {
                                $_day.find('.datepicker_1_calendar_1_months_month_weekdays_weekday_days_day_number').html(_day);
                            }

                            $_day.appendTo($_month_weekday_days);
                        }

                        $_month_weekday.appendTo($_month_weekdays);
                    }

                    $_month.addClass('datepicker_1_calendar_1_months_month-month-'+_month);
                    $_month.appendTo($months);
                }

                $label_year.html(calendar_current_year);

                process_date_other();
            });

            $datepicker.on('select_month.datepicker', function (event, params) {  
                params.month = parseInt(params.month);

                calendar_current_month = params.month;

                $current_month = $datepicker.find('.datepicker_1_calendar_1_months_month-month-'+params.month);
                $label_month.html(jQueryDatepicker.month_names[calendar_current_month]);
                $datepicker.find('.datepicker_1_calendar_1_months_month').not('.datepicker_1__proto').not($current_month).hide().removeClass('__current');
                $current_month.show().addClass('__current');

                process_date_other();
            });

            $datepicker.on('change_month.datepicker', function (event, params) {
                var new_month;
                var new_year;

                if (params.rotation == 'next') {
                    new_month = calendar_current_month + 1;
                    if (new_month > 12) {
                        new_year = calendar_current_year + 1;
                        new_month = 1;
                    } else {
                        new_year = calendar_current_year;
                    }
                } else if (params.rotation = 'previous') {
                    new_month = calendar_current_month - 1;
                    if (new_month < 1) {
                        new_year = calendar_current_year - 1;
                        new_month = 12;
                    } else {
                        new_year = calendar_current_year;
                    }
                }

                if (calendar_current_year != new_year) {
                    $datepicker.trigger('select_year.datepicker', {year: new_year});
                }

                $datepicker.trigger('select_month.datepicker', {month: new_month});
            });

            var process_date_other = function () {
                $datepicker.find('.datepicker_1_calendar_1_months_month_weekdays_weekday_days_day')
                           .removeClass('__current_other')
                           .removeClass('__current_other_diff');

                if (
                    calendar_current_year == calendar_current_year_other &&
                    calendar_current_month == calendar_current_month_other
                ) {
                    $datepicker.find('.datepicker_1_calendar_1_months_month_weekdays_weekday_days_day-day-'+calendar_current_day_other).addClass('__current_other');
                }

                if (selected_year == calendar_current_year_other) {
                    if (selected_month == calendar_current_month_other) {
                        for (var i=calendar_current_day_other+1; i < calendar_current_day; i++) {
                            $datepicker.find('.datepicker_1_calendar_1_months_month-month-'+selected_month)
                                       .find('.datepicker_1_calendar_1_months_month_weekdays_weekday_days_day-day-'+i)
                                       .addClass('__current_other_diff');
                        }
                    } else if (selected_month > calendar_current_month_other) {
                        for (var _month=calendar_current_month_other; _month <= selected_month; _month++) {
                            if (_month != selected_month) {
                                if (_month == calendar_current_month_other) {
                                    for (var i=calendar_current_day_other+1; i < 32; i++) {
                                        $datepicker.find('.datepicker_1_calendar_1_months_month-month-'+_month)
                                                   .find('.datepicker_1_calendar_1_months_month_weekdays_weekday_days_day-day-'+i)
                                                   .addClass('__current_other_diff');
                                    }
                                } else {
                                    for (var i=1; i < 32; i++) {
                                        $datepicker.find('.datepicker_1_calendar_1_months_month-month-'+_month)
                                                   .find('.datepicker_1_calendar_1_months_month_weekdays_weekday_days_day-day-'+i)
                                                   .addClass('__current_other_diff');
                                    }
                                }
                            } else {
                                for (var i=1; i < selected_day; i++) {
                                    $datepicker.find('.datepicker_1_calendar_1_months_month-month-'+_month)
                                               .find('.datepicker_1_calendar_1_months_month_weekdays_weekday_days_day-day-'+i)
                                               .addClass('__current_other_diff');
                                }
                            }
                        }
                    }
                } else if (selected_year > calendar_current_year_other) {
                    if (selected_year == calendar_current_year) {
                        for (var m=1; m < selected_month; m++) {
                            $datepicker.find('.datepicker_1_calendar_1_months_month-month-'+m)
                                       .find('.datepicker_1_calendar_1_months_month_weekdays_weekday_days_day')
                                       .addClass('__current_other_diff');
                        }

                        for (var d=1; d < selected_day; d++) {
                            $datepicker.find('.datepicker_1_calendar_1_months_month-month-'+selected_month)
                                       .find('.datepicker_1_calendar_1_months_month_weekdays_weekday_days_day-day-'+d)
                                       .addClass('__current_other_diff');
                        }
                    } else if (calendar_current_year == calendar_current_year_other) {
                        if (calendar_current_month == calendar_current_month_other) {
                            for (var d=calendar_current_day_other+1; d < 32; d++) {
                                $datepicker.find('.datepicker_1_calendar_1_months_month-month-'+calendar_current_month)
                                           .find('.datepicker_1_calendar_1_months_month_weekdays_weekday_days_day-day-'+d)
                                           .addClass('__current_other_diff');
                            }
                        } else if (calendar_current_month > calendar_current_month_other) {
                            $datepicker.find('.datepicker_1_calendar_1_months_month-month-'+calendar_current_month)
                                       .find('.datepicker_1_calendar_1_months_month_weekdays_weekday_days_day')
                                       .addClass('__current_other_diff');
                        }
                    } else if (selected_year > calendar_current_year) {
                        for (var m=1; m <= 12; m++) {
                            $datepicker.find('.datepicker_1_calendar_1_months_month-month-'+m)
                                       .find('.datepicker_1_calendar_1_months_month_weekdays_weekday_days_day')
                                       .addClass('__current_other_diff');
                        }
                    }
                }
            };

            $datepicker.on('select_day.datepicker', function (event, params) {
                calendar_current_day = parseInt(params.day);
                var _date = new Date(calendar_current_year, calendar_current_month-1, calendar_current_day); // ??
                calendar_current_weekday = _date.getDay() == 0 ? 7: _date.getDay();
                $current_day = $current_month.find('.datepicker_1_calendar_1_months_month_weekdays_weekday_days_day-day-'+calendar_current_day);
                $datepicker.find('.datepicker_1_calendar_1_months_month_weekdays_weekday_days_day').not($current_day).removeClass('__current');
                $current_day.addClass('__current');

                selected_year = calendar_current_year;
                selected_month = calendar_current_month;
                selected_day = calendar_current_day;
                selected_dayofweek = calendar_current_weekday;

                $datepicker.trigger('date_selected.datepicker', {
                    details: {
                        year: selected_year,
                        month: selected_month,
                        day: selected_day,
                        dayofweek: selected_dayofweek
                    },
                    date: _date,
                    from_user: params['from_user']
                });
                
                process_date_other();
            });

            $datepicker.on('set_date_other.datepicker', function (event, params) {
                calendar_current_year_other = parseInt(params.year);
                calendar_current_month_other = parseInt(params.month);
                calendar_current_day_other = parseInt(params.day);

                $datepicker.trigger('select_date_other.datepicker');
            });

            $datepicker.on('select_date_other.datepicker', function (event, params) {
                process_date_other();
            });

            $datepicker.find('.datepicker_1_rotation_button').on('click.datepicker', function (event) {
                var $button = $(this);
                $datepicker.trigger('change_month.datepicker', {rotation: $button.attr('rotation')});
            });

            $datepicker.find('.datepicker_1_calendar_1_months_month_weekdays_weekday_days_day').on('click.datepicker', function (event) {
                var $day = $(this);
                if ($day.hasClass('__current_other') || $day.hasClass('__previous_month')) {
                    return;
                }

                $current_day = $day;

                $datepicker.trigger('select_day.datepicker', {
                    day: parseInt($current_day.attr('day')),
                    from_user: true
                });
            });

            $datepicker.trigger('initialize.datepicker');
        });
    };
};

jQueryDatepicker.day_names_short = {
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat',
    7: 'Sun'
};

jQueryDatepicker.day_names = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday'
};

jQueryDatepicker.month_names = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'Apri',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
};

// ----------------------------------------

(function($){
    var html_proto = (function () {/*
        <div class="datepicker_1">
            <div class="datepicker_1_content_1">
                <div class="datepicker_1_table">
                    <div class="datepicker_1_table_td">
                        <span class="datepicker_1_label_month">
                            
                        </span>
                        <span class="datepicker_1_label_year">
                            
                        </span>
                    </div>
                </div>

                <div class="datepicker_1_rotation_button datepicker_1_content_1_sidebutton datepicker_1_content_1_sidebutton__left datepicker_1_content_1_sidebutton__left" rotation="previous">
                    <div class="datepicker_1_table">
                        <div class="datepicker_1_table_td">
                            <div class="datepicker_1_content_1_sidebutton_content"></div>
                        </div>
                    </div>
                </div>

                <div class="datepicker_1_rotation_button datepicker_1_content_1_sidebutton datepicker_1_content_1_sidebutton__right datepicker_1_content_1_sidebutton__right" rotation="next">
                    <div class="datepicker_1_table">
                        <div class="datepicker_1_table_td">
                            <div class="datepicker_1_content_1_sidebutton_content"></div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="datepicker_1_content_2">
                <div class="datepicker_1_calendar_1">
                    <div class="datepicker_1_calendar_1_months">
                        <div class="datepicker_1_calendar_1_months_month datepicker_1__proto">
                            <div class="datepicker_1_calendar_1_months_month_weekdays">
                                <div class="datepicker_1_calendar_1_months_month_weekdays_weekday datepicker_1__proto">
                                    <div class="datepicker_1_calendar_1_months_month_weekdays_weekday_title">
                                    </div>
                                    <div class="datepicker_1_calendar_1_months_month_weekdays_weekday_days">
                                        <div class="datepicker_1_calendar_1_months_month_weekdays_weekday_days_day datepicker_1__proto">
                                            <div class="datepicker_1_table">
                                                <div class="datepicker_1_table_td">
                                                    <div class="datepicker_1_calendar_1_months_month_weekdays_weekday_days_day_number"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    */}).toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];
    var $html_proto = $(html_proto);
    
    var methods = {
        init: function(parameters) {
            t_init = this;
            var $elements = $(this);

            if (typeof parameters == 'undefined') {
                parameters = {};
            }

            t_init.parameters = parameters;

            if (!t_init.parameters.hasOwnProperty('next_button')) {
                t_init.parameters.next_button = '&gt;';
            }

            if (!t_init.parameters.hasOwnProperty('prev_button')) {
                t_init.parameters.prev_button = '&lt;';
            }

            $elements.each(function () {
                var $element = $(this);
                
                $element.html(html_proto).addClass('datepicker_1');

                $element.find('.datepicker_1_content_1_sidebutton__right .datepicker_1_content_1_sidebutton_content')
                .html(t_init.parameters.next_button);
                $element.find('.datepicker_1_content_1_sidebutton__left .datepicker_1_content_1_sidebutton_content')
                .html(t_init.parameters.prev_button);

                var datepicker = new jQueryDatepicker({
                    $element: $element
                });

                datepicker.initialize();
            });
        }
    };

    $.fn.datepicker = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method '+method+' does not exist on jQuery.datepicker');
        }
    };

    $.fn.setStartDate = function (parameters) {
        var $element = $(this);
        $element.trigger('set_date_other.datepicker', parameters);
    };
})(jQuery);
