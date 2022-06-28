import ApiError from "../classes/ApiError.js";
import shortid from "shortid";
import Link from "../models/links.js";

export const createLink = async (req, res, next) => {
  try {
    const { longUrl } = req.body;
    if (!longUrl) {
      throw ApiError.BadRequest("long url is required");
    }
    let url = await Link.findOne({ long: longUrl });
    if (url) {
      return res.status(200).json({ data: `${req.headers.host}/${url.short}` });
    }

    url = new Link({
      long: longUrl,
      short: shortid.generate(),
      createdBy: req.user.userId,
    });

    await url.save();
    return res.status(200).json({ data: `${req.headers.host}/${url.short}` });
  } catch (e) {
    next(e);
  }
};

export const deleteLink = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw ApiError.BadRequest("url is required");
    }
    const url = await Link.findById(id);
    if (!url) {
      throw ApiError.NotFound("url not found");
    }
    if (url.createdBy.toString() !== req.user.userId.toString()) {
      throw ApiError.Unauthorized("you are not authorized to delete this url");
    }
    await url.remove();
    return res.status(200).json({ data: "url deleted" });
  } catch (e) {
    next(e);
  }
};
