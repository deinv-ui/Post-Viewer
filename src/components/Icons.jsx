import { FaHeart, FaRegHeart, FaUser, FaStar } from "react-icons/fa";

const ICON_SIZE = 18;
const ICON_COLOR = "#6B7280"; 

const Icons = {
  Heart: (props) => <FaHeart size={ICON_SIZE} color={ICON_COLOR} {...props} />,
  HeartOutline: (props) => <FaRegHeart size={ICON_SIZE} color={ICON_COLOR} {...props} />,
  User: (props) => <FaUser size={ICON_SIZE} color={ICON_COLOR} {...props} />,
  Star: (props) => <FaStar size={ICON_SIZE} color={ICON_COLOR} {...props} />,
};

export default Icons;
