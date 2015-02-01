# jquery.datepicker
a futuristic datepicker for web

<img src="http://oguzhaneroglu.com/static/images/jquery.datepicker.png" />

###Init

```javascript
$(document).ready(function () {
    var $selected = $('.selected');

    $some_datepicker = $('.some_datepicker');
    
    $some_datepicker.datepicker({
        next_button: '&gt;',
        prev_button: '&lt;'
    });

    $some_datepicker.setStartDate({
        year: 2015,
        // jquery.datepicker accepts first month as 1
        // (built-in Date() class accepts first month as 0)
        month: 1,
        day: 3
    });

    $some_datepicker.on('date_selected.datepicker', function (event, date) {
        $selected.show().html('Selected date is: '+date.date.toString());
    });
});
```

###HTML

```html
<div style="width: 300px; font-family: 'Arial'; margin: auto;">
    <div class="some_datepicker">
    </div>
</div>
<div class="selected" style="margin: auto;margin-top: 15px;">
</div>
```

###I18N

```javascript
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
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'Agust',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
};
```

##License
MIT
