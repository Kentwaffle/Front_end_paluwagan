import Default_pic from "../../assets/images/default_pic.jpg";
export const getProfileImage = (url) => {
  if (!url) return Default_pic;

  if (url.startsWith("blob:")) return url;

  return `${url}?t=${new Date().getTime()}`;
};
