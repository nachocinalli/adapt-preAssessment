define(function(require) {
    var Adapt = require('coreJS/adapt');
    var Backbone = require('backbone');
    var PreAssessmentItemView = Backbone.View.extend({
        className: 'menu-item-pre-assessment',
        initialize: function () {
            this.render()
           
        },
        render:function(){          
           
            var template = Handlebars.templates["preAssessmentMenuItem"];
            this.$el.html(template(this.model));
           
            return this;
        }
    });
    return PreAssessmentItemView;

});