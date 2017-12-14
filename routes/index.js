var express         = require("express"),
    router          = express.Router({mergeParams: true});
    
    
router.get("/", function (req, res) {
    res.render("landing")
});

router.get("/cryptocurrency-calculator", function(req, res) {
    res.render("calculator")
});

router.get("/what-are-cryptocurrency", function(req, res) {
    res.render("what");
});

router.get("/best-place-to-buy-cryptocurrency-bitcoin", function(req, res) {
    res.render("where");
});

router.get("/contact", function(req, res) {
    res.render("contact");
});

router.get("/*", function(req, res) {
    res.render("not-found");
});

module.exports = router;