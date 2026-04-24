import React from "react";
import {
  FaGithub,
  FaLinkedin,
  FaTwitter,
  FaGlobe,
  FaBehance,
  FaDribbble,
  FaMedium,
  FaInstagram,
  FaFacebook,
  FaYoutube,
  FaStackOverflow,
  FaHackerrank,
  FaCode,
} from "react-icons/fa";
import {
  SiLeetcode,
  SiGeeksforgeeks,
  SiCodechef,
  SiCodeforces,
  SiKaggle,
} from "react-icons/si";
import { Link2 } from "lucide-react";

const SocialIcon = ({ platform, className = "" }) => {
  // Normalize platform name for creating keys
  const key = platform?.toLowerCase().replace(/\s+/g, "");

  const iconMap = {
    // Professional / Tech
    linkedin: <FaLinkedin className={className} />,
    github: <FaGithub className={className} />,
    leetcode: <SiLeetcode className={className} />,
    hackerrank: <FaHackerrank className={className} />,
    geeksforgeeks: <SiGeeksforgeeks className={className} />,
    codechef: <SiCodechef className={className} />,
    codeforces: <SiCodeforces className={className} />,
    kaggle: <SiKaggle className={className} />,
    stackoverflow: <FaStackOverflow className={className} />,

    // Creative / Social
    dribbble: <FaDribbble className={className} />,
    behance: <FaBehance className={className} />,
    medium: <FaMedium className={className} />,
    twitter: <FaTwitter className={className} />,
    x: <FaTwitter className={className} />, // X maps to Twitter icon usually
    instagram: <FaInstagram className={className} />,
    facebook: <FaFacebook className={className} />,
    youtube: <FaYoutube className={className} />,

    // Generic
    portfolio: <FaGlobe className={className} />,
    website: <FaGlobe className={className} />,
    other: <Link2 className={className} />,
  };

  return iconMap[key] || <Link2 className={className} />;
};

export default SocialIcon;

export const socialPlatforms = [
  "LinkedIn",
  "GitHub",
  "Portfolio",
  "LeetCode",
  "GeeksForGeeks",
  "HackerRank",
  "CodeChef",
  "CodeForces",
  "Kaggle",
  "Dribbble",
  "Behance",
  "Medium",
  "Twitter",
  "Instagram",
];
