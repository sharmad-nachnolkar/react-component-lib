"use strict";
var OnClickOutsideHandler = (function () {
    function OnClickOutsideHandler(localNode, callback) {
        var _this = this;
        this.localNode = localNode;
        this.callback = callback;
        this.eventHandler = function (event) {
            var source = event.target;
            var found = false;
            // If source=local then this event came from "somewhere"
            // inside and should be ignored. We could handle this with
            // a layered approach, too, but that requires going back to
            // thinking in terms of Dom node nesting, running counter
            // to React's "you shouldn't care about the DOM" philosophy.
            while (source.parentNode) {
                found = (source === _this.localNode);
                if (found)
                    return;
                source = source.parentNode;
            }
            _this.callback(event);
        };
        if (!callback)
            throw new Error("Missing callback");
        document.addEventListener("mousedown", this.eventHandler);
        document.addEventListener("touchstart", this.eventHandler);
    }
    OnClickOutsideHandler.prototype.dispose = function () {
        document.removeEventListener("mousedown", this.eventHandler);
        document.removeEventListener("touchstart", this.eventHandler);
    };
    return OnClickOutsideHandler;
}());
export default OnClickOutsideHandler
