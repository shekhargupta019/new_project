export interface NewsStory {
  slug: string;
  category: string;
  title: {
    en: string;
    hi: string;
  };
  description: {
    en: string;
    hi: string;
  };
  content: {
    en: string[];
    hi: string[];
  };
  publishedAt: string;
}

export const newsStories: NewsStory[] = [
  {
    slug: "uttar-pradesh-development",
    category: "Uttar Pradesh",
    title: {
      en: "Uttar Pradesh announces new development initiatives",
      hi: "उत्तर प्रदेश में विकास की नई पहल की घोषणा",
    },
    description: {
      en: "A look at the latest plans and announcements from the state.",
      hi: "प्रदेश की नई योजनाओं और घोषणाओं पर एक नज़र।",
    },
    content: {
      en: [
        "This is sample news content for the Talk Tantra India website.",
        "Replace this content with verified reporting before publishing.",
      ],
      hi: [
        "यह टॉक तंत्रा इंडिया वेबसाइट के लिए नमूना समाचार सामग्री है।",
        "प्रकाशित करने से पहले इसे सत्यापित समाचार से बदलें।",
      ],
    },
    publishedAt: "Today",
  },
  {
    slug: "business-market-update",
    category: "Business",
    title: {
      en: "Business and markets: key developments to watch",
      hi: "कारोबार और बाज़ार: इन अहम घटनाक्रमों पर रहेगी नज़र",
    },
    description: {
      en: "Important business updates and market developments in focus.",
      hi: "कारोबार की प्रमुख खबरें और बाज़ार के ताज़ा घटनाक्रम।",
    },
    content: {
      en: ["This is sample business news content."],
      hi: ["यह कारोबार से जुड़ी नमूना समाचार सामग्री है।"],
    },
    publishedAt: "Today",
  },
  {
    slug: "national-latest-updates",
    category: "India",
    title: {
      en: "Latest national updates and important headlines",
      hi: "देश की ताज़ा खबरें और आज की प्रमुख सुर्खियां",
    },
    description: {
      en: "A quick roundup of important stories from across India.",
      hi: "देशभर की महत्वपूर्ण खबरों का संक्षिप्त अपडेट।",
    },
    content: {
      en: ["This is sample national news content."],
      hi: ["यह देश से जुड़ी नमूना समाचार सामग्री है।"],
    },
    publishedAt: "Today",
  },
];
