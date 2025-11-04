import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import useInterval from '../hooks/interval';

interface NewsModuleProps {
  className: string;
  links: string[];
}

interface News {
  id: string;
  title: string;
  link: string;
  description: string;
  date: Date;
  from: string;
}
export default function NewsModule({ className, links }: NewsModuleProps) {
  const [news, setNews] = useState<News[]>([]);


  const grab = async () => {
    console.log("UPDATING NEWS")
    for (const link of links) {
      const res = await getNews(link);
      setNews(prevNews => {
        const combined = [...prevNews, ...res];
        const uniqueByTitle = combined.reduce((acc: News[], current) => {
          if (!acc.find(item => item.id === current.id)) {
            acc.push(current);
          }
          return acc;
        }, []);
        uniqueByTitle.sort((a, b) => b.date.getTime() - a.date.getTime());
        return uniqueByTitle.slice(0, 30);
      });
    }
  };

  useEffect(() => {
    grab();
  }, [links]);
  useInterval(grab, 1000 * 60 * 5);
  return (
    <div className={`${className} max-h-full bloom-white p-4 outline`}>
      <div className="flex flex-col overflow-hidden h-full">
        <AnimatePresence initial={false}>
          {news.map(item => (
            <NewsItem key={item.id} item={item} />
          ))}
        </AnimatePresence>
      </div>
    </div >
  );
}


interface NewsItemProps {
  item: News,
}
function NewsItem({ item }: NewsItemProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !textRef.current) return;

    const containerWidth = containerRef.current.offsetWidth;
    const textWidth = textRef.current.scrollWidth;

    setShouldScroll(textWidth > containerWidth);
  }, [item.title]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-row gap-2 w-full"
    >
      <p className="text-nowrap shrink">[{prettyDate(item.date)}]</p>
      <div className="grow overflow-hidden">
        <p className={`${shouldScroll ? "animate-scroll" : ""} text-nowrap`}>{item.title}</p>
      </div>
    </motion.div>
  );
}
async function getNews(link: string): Promise<News[]> {
  console.log("GRABBING " + link)
  try {
    const res = await fetch(`https://api.allorigins.win/raw?url=${link}`);
    const text = await res.text();
    const xml = new DOMParser().parseFromString(text, "application/xml");
    const items = xml.querySelectorAll("item");
    return Array.from(items).map(item => ({
      id: item.querySelector("title")?.textContent ?? "",
      title: item.querySelector("title")?.textContent ?? "",
      link: item.querySelector("link")?.textContent ?? "",
      description: item.querySelector("description")?.textContent ?? "",
      date: new Date(item.querySelector("pubDate")?.textContent ?? ""),
      from: link,
    }));
  }
  catch {
    return [];
  }
}

function prettyDate(date: Date): string {

  const MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  const day = String(date.getDate());
  const month = MONTHS[date.getMonth()];
  return `${hours}:${minutes}:${seconds} - ${day}/${month}`;
}
