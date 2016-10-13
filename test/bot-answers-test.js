describe('Bot answers ', function () {

    it("Should load the bot answers", function () {
        console.log(`Loading bot answers`);
        var answers = require('../bot-answers.json');
        console.log(`Loaded ${Object.keys(answers).length} answers`);
    });
});
