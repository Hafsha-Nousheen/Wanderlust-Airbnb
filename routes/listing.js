const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listings.js")
const multer=require("multer");
const {storage}=require("../coludConfig.js")
const upload=multer({storage});
const Listing=require("../models/listing.js")


router.route("/").get(wrapAsync(listingController.index))
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(listingController.createListing));

//new route
router.get("/new",isLoggedIn,listingController.renderNewForm); 

router.route("/:id").get(wrapAsync(listingController.showListing)).put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing,wrapAsync(listingController.updateListing)).delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));

//edit route
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

router.get('/', async (req, res) => {
    try {
        const allListings = await Listing.find().populate("owner"); // Fetch all listings
        res.render("listings/index.ejs", { allListings }); // Render the listings page
    } catch (error) {
        console.error(error);
        req.flash('error', 'Something went wrong while fetching listings.');
        res.redirect('/listings');
    }
});
 module.exports=router;
 