define([
    'core/js/adapt',
    './PreAssessmentItemView'
], function (Adapt, PreAssessmentItemView) {

    function onAssessmentCompleted(stateObject, assessmentModel) {

        if (stateObject.id == Adapt.course.get('_preAssessment')._assessmentId) {
            var preAssessmentBlocks =Adapt.assessment._assessments._byAssessmentId[Adapt.course.get('_preAssessment')._assessmentId].get('_children')
            var _preAssessmentModel = Adapt.course.get('_preAssessment');

            _.each(_preAssessmentModel._config, function (_config, index) {
                var questionsArr = []
                var i = 0
                preAssessmentBlocks.forEach(function (block) {

                    if (block.get('_assessment')._quizBankID == _config._quizBankID) {
                        questionsArr[i] = block.findDescendantModels("components", { where: { _isQuestionType: true } })[0];
                        i++
                    }
                })

                setPreAssessment(_preAssessmentModel, questionsArr, index)
            })

        }
    }

    function setPreAssessment(preAssessmentModel, questions, index) {
        var _pagePreAssessment = {};
        var _scorePercent = 0;
        var _correctResponses = 0;

        var _page = Adapt.findById(preAssessmentModel._config[index]._pageId)

        for (var i = 0, l = questions.length; i < l; i++) {
            if (questions[i].get('_isCorrect')) {
                _correctResponses++
            }
        }
        _scorePercent = Math.round((_correctResponses / questions.length) * 100)
        preAssessmentModel._config[index]._scorePercent = _scorePercent
        _page.set("_pagePreAssessment", { '_scorePercent': _scorePercent, '_scoreLabel': preAssessmentModel._showScoresOnMenu._scoreLabel })

        if (preAssessmentModel._setStatusCompleted._isEnabled)
            if (_scorePercent == 100) {
                if (preAssessmentModel._setStatusCompleted._isSequential && index > 0) {
                    if (preAssessmentModel._config[index - 1]._scorePercent == 100) {
                        _page.setOnChildren('_isComplete', true);
                    }
                }
                else {
                    _page.setOnChildren('_isComplete', true);
                }
            }
    }

    function renderMenuItemIndicatorView(view) {
        if (view.model.get('_id') === Adapt.location._currentId) {
            return;
        }

        var viewType = view.model.get('_type');
        if (viewType === 'course') {
            return;
        }
        var _pagePreAssessmentModel = view.model.get('_pagePreAssessment');

        if (_pagePreAssessmentModel) {

            view.$el.find('.menu-item-inner').prepend(new PreAssessmentItemView({
                model: _pagePreAssessmentModel
            }).$el);


        }
    }
    Adapt.on('app:dataReady', function () {
        var preAssessmentModel = Adapt.course.get('_preAssessment');
        if (preAssessmentModel && preAssessmentModel._isEnabled) {
            Adapt.on('assessments:complete', onAssessmentCompleted)
            if (preAssessmentModel._showScoresOnMenu) {
                Adapt.on('menuView:postRender', renderMenuItemIndicatorView)
            }

        }
    })

});
