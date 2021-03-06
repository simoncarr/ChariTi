windowFunctions['Unsubscribe'] = function (evt) {
    var win = createWindow();
    var offset = addBackButton(win);
    var content = Ti.UI.createScrollView({
        top: offset + u,
        contentHeight: 'auto',
        layout: 'vertical'
    });
    win.add(content);

    if (!pushDeviceToken) {
        content.add(Ti.UI.createLabel({
            text: 'Please visit Push Notifications > Settings to enable push!',
            textAlign: 'center',
            color: '#000',
            height: 'auto'
        }));
        win.open();
        return;
    }

    var channel = Ti.UI.createTextField({
        hintText: 'Channel (leave blank for all)',
        top: 10 + u, left: 10 + u, right: 10 + u,
        height: 40 + u,
        borderStyle: Ti.UI.INPUT_BORDERSTYLE_ROUNDED,
        autocapitalization: Ti.UI.TEXT_AUTOCAPITALIZATION_NONE,
        autocorrect: false
    });
    content.add(channel);

    var button = Ti.UI.createButton({
        title: 'Unsubscribe',
        top: 10 + u, left: 10 + u, right: 10 + u, bottom: 10 + u,
        height: 40 + u
    });
    content.add(button);

    var fields = [ channel ];

    function submitForm() {
        for (var i = 0; i < fields.length; i++) {
            fields[i].blur();
        }
        button.hide();

        var data = {
            device_token: pushDeviceToken
        };

        if (channel.value && channel.value.length) {
            data.channel = channel.value;
        }
        Cloud.PushNotifications.unsubscribe(data, function (e) {
            if (e.success) {
                channel.value = '';
                alert('Unsubscribed!');
            }
            else {
                error(e);
            }
            button.show();
        });
    }

    button.addEventListener('click', submitForm);
    for (var i = 0; i < fields.length; i++) {
        fields[i].addEventListener('return', submitForm);
    }

    win.addEventListener('open', function () {
        channel.focus();
    });
    win.open();
};