const Listing = require("../model/listing");

module.exports.index = async (req, res) => {
    let data = await Listing.find();
    res.render("./Listing/listing.ejs", { data });
}

module.exports.new = (req, res) => {
    res.render("./Listing/new.ejs");
}

module.exports.newListing = async (req, res) => {
    let data = req.body;
    let url=req.file.path;
    let filename=req.file.filename;
    let newListing = new Listing(data);
    newListing.owner=req.user._id;
    newListing.image={url,filename}
    await newListing.save();
    req.flash('success', 'New Listing Created!');
    return res.redirect("/listing"); // ✅ Added return
}

module.exports.individualListing = async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id)
                    .populate({
                        path:"review",
                        populate:{
                            path:"author"
                        },
                    })
                    .populate("owner");

    if (!data) {
        req.flash('error', 'Listing Does Not Exist!');
        return res.redirect("/listing"); // ✅ Added return
    }

    res.render("./Listing/individual.ejs", { data });
}

module.exports.editForm = async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);

    if (!data) {
        req.flash('error', 'Listing Does Not Exist!');
        return res.redirect("/listing"); // ✅ Added return
    }

    res.render("./Listing/edit.ejs", { data });
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let updatedData = req.body;
    let updatedListing = await Listing.findByIdAndUpdate(id, updatedData, { runValidators: true, new: true });

    if (!updatedListing) {
        req.flash('error', 'Listing Does Not Exist!');
        return res.redirect("/listing"); // ✅ Added return
    }
    if(typeof req.file !== "undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        updatedListing.image={url,filename}
        await updatedListing.save();
    }
    req.flash('success', 'Listing Updated!');
    return res.redirect(`/listing/${id}`); // ✅ Added return
}

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
        req.flash('error', 'Listing Does Not Exist!');
        return res.redirect("/listing"); // ✅ Added return
    }
    req.flash('success', 'Listing Deleted!');
    return res.redirect("/listing"); // ✅ Added return
}