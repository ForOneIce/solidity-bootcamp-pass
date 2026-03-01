import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, CalendarDays, Heart, Star, Sparkles, Trophy } from 'lucide-react';

const Course = ({ title, level }: { title: string, level: '初级' | '中级' | '高级' }) => {
  const colors = {
    '初级': 'bg-purple-400 shadow-[0_0_6px_rgba(192,132,252,0.8)]',
    '中级': 'bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]',
    '高级': 'bg-yellow-400 shadow-[0_0_6px_rgba(250,204,21,0.8)]'
  };
  const labels = {
    '初级': '初级 Fundamentals',
    '中级': '中级 Intermediate',
    '高级': '高级 Advanced'
  };
  return (
    <div className="mb-1">
      <div className="text-white/90 leading-snug">{title}</div>
      <div className="flex items-center gap-1.5 mt-1.5 text-xs text-white/60">
        <span className={`w-2 h-2 rounded-full ${colors[level]}`}></span>
        {labels[level]}
      </div>
    </div>
  );
};

const AstronautFlipbook = ({ date }: { date: Date }) => {
  const start = Date.UTC(2026, 1, 28);
  const current = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  const frame = Math.floor((current - start) / (1000 * 60 * 60 * 24));

  if (frame < 0 || frame > 36) return null;

  const progress = frame / 36;
  
  const x = 20 + progress * 160;
  const y = 30 + Math.sin(progress * Math.PI * 6) * 10;
  
  let rotation = Math.sin(progress * Math.PI * 10) * 15;
  if (frame > 15 && frame < 25) {
    rotation = ((frame - 15) / 10) * 360;
  } else if (frame >= 25) {
    rotation = 0;
  }

  const leftArmY = Math.sin(frame) * 5;
  const rightArmY = Math.cos(frame) * 5;
  const leftLegY = Math.cos(frame) * 5;
  const rightLegY = Math.sin(frame) * 5;

  const jitterX = (frame % 3) - 1;
  const jitterY = (frame % 2) - 0.5;

  const trail = Array.from({ length: frame }).map((_, i) => {
    if (i % 2 !== 0) return null;
    const p = i / 36;
    const sx = 20 + p * 160;
    const sy = 30 + Math.sin(p * Math.PI * 6) * 10;
    return <circle key={i} cx={sx} cy={sy} r="0.8" fill="currentColor" opacity={0.1 + (i/36)*0.4} />;
  });

  return (
    <div className="absolute top-2 left-0 w-full h-28 pointer-events-none opacity-60 text-indigo-200/80 z-0">
      <svg viewBox="0 0 200 60" className="w-full h-full overflow-visible">
        <path d="M 0 55 Q 100 45 200 55" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 4" opacity="0.3" />
        
        <g transform="translate(180, 55)" opacity={progress === 1 ? 1 : 0.3}>
          <line x1="0" y1="0" x2="0" y2="-25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 0 -25 L 12 -20 L 0 -15" fill={progress === 1 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
        </g>

        {trail}

        <g transform={`translate(${x + jitterX}, ${y + jitterY}) rotate(${rotation})`}>
          <rect x="-7" y="-5" width="5" height="10" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <rect x="-4" y="-4" width="8" height="12" rx="2.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="0" cy="-10" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M -3 -11 Q 0 -13 3 -11" fill="none" stroke="currentColor" strokeWidth="1" />
          
          <line x1="-4" y1="-2" x2="-9" y2={-2 + leftArmY} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="4" y1="-2" x2="9" y2={-2 + rightArmY} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          
          <line x1="-2" y1="8" x2="-3" y2={13 + leftLegY} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="8" x2="3" y2={13 + rightLegY} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </g>
      </svg>
    </div>
  );
};

const SCHEDULE: Record<string, { title: string, desc: React.ReactNode, sticker?: 'heart' | 'star' | 'sparkles' | 'trophy' }> = {
  "2026-02-28": { title: "DAY 0", desc: <><div className="font-bold text-white mb-2">Warm-up Day 开学准备日</div><div className="text-white/80">20:00 嘉宾分享：凡 - AI行业工作岗位</div></>, sticker: 'heart' },
  "2026-03-01": { title: "DAY 1", desc: <><div className="font-bold text-white mb-2">Welcome Day 开学迎新日</div><Course title="点击计数器 ClickCounter Contract" level="初级" /><div className="mt-2 text-white/80 border-t border-white/10 pt-2">20:00 嘉宾分享：Bala - web3入门分享</div></>, sticker: 'heart' },
  "2026-03-02": { title: "DAY 2", desc: <Course title="存储姓名和简介 SaveMyName Contract" level="初级" /> },
  "2026-03-03": { title: "DAY 3", desc: <Course title="投票站合约 PollStation Contract" level="初级" /> },
  "2026-03-04": { title: "DAY 4", desc: <Course title="拍卖行合约 AuctionHouse Contract" level="初级" /> },
  "2026-03-05": { title: "DAY 5", desc: <Course title="管理控制 Admin-Only Contract" level="初级" /> },
  "2026-03-06": { title: "DAY 6", desc: <Course title="发送功能 The Ether Piggy Bank" level="初级" /> },
  "2026-03-07": { title: "DAY 7", desc: <Course title="IOU合约 Simple IOU Contract" level="初级" /> },
  "2026-03-08": { title: "DAY 8", desc: <><Course title="多币种支付合约 TipJar Contract" level="初级" /><div className="mt-2 text-white/80 border-t border-white/10 pt-2">20:00 嘉宾分享：佳佳 - 代码入门</div></>, sticker: 'heart' },
  "2026-03-09": { title: "DAY 9", desc: <Course title="智能计算器合约 Smart Calculator Contract" level="初级" /> },
  "2026-03-10": { title: "DAY 10", desc: <Course title="链上健身记录器 ActivityTracker Contract" level="初级" /> },
  "2026-03-11": { title: "DAY 11", desc: <Course title="钱库控制合约 Masterkey Contract" level="中级" /> },
  "2026-03-12": { title: "DAY 12", desc: <><Course title="第一次ERC20合约 MyFirstToken Contract" level="中级" /><div className="mt-2 text-white/80 border-t border-white/10 pt-2">20:00 嘉宾分享：八两 - AI Workflow</div></>, sticker: 'heart' },
  "2026-03-13": { title: "DAY 13", desc: <Course title="预售功能设置 PreorderTokens" level="中级" /> },
  "2026-03-14": { title: "DAY 14", desc: <Course title="模块化金库系统合约 SafeDeposit Contract" level="中级" /> },
  "2026-03-15": { title: "DAY 15", desc: <><Course title="Gas节省方式 Gas-Efficient Voting" level="中级" /><div className="mt-2 text-white/80 border-t border-white/10 pt-2">20:00-22:00 Office Hour 答疑时间</div></>, sticker: 'star' },
  "2026-03-16": { title: "DAY 16", desc: <Course title="模块化的玩家配置文件系统 PluginStore Contract" level="中级" /> },
  "2026-03-17": { title: "DAY 17", desc: <Course title="合约可升级性 Upgradeable Contracts" level="中级" /> },
  "2026-03-18": { title: "DAY 18", desc: <Course title="oracle预言机 What Are Oracles — and Why Do Smart Contracts Need Them?" level="中级" /> },
  "2026-03-19": { title: "DAY 19", desc: <Course title="签名验证 SignThis Contract" level="中级" /> },
  "2026-03-20": { title: "DAY 20", desc: <Course title="重入攻击 FortKnox Contract" level="中级" /> },
  "2026-03-21": { title: "DAY 21", desc: <Course title="简易的NFT合约 - ERC721 Simple ERC-721" level="高级" /> },
  "2026-03-22": { title: "DAY 22", desc: <><Course title="去中心化彩票 DecentralisedLottery Contract" level="高级" /><div className="mt-2 text-white/80 border-t border-white/10 pt-2">20:00-22:00 Office Hour 答疑时间</div></>, sticker: 'star' },
  "2026-03-23": { title: "DAY 23", desc: <Course title="DeFi借贷合约 LendingPool Contract" level="高级" /> },
  "2026-03-24": { title: "DAY 24", desc: <Course title="去中心化托管 DecentraliseEscrow Contract" level="高级" /> },
  "2026-03-25": { title: "DAY 25", desc: <Course title="自动做市商合约 Automated Market Maker" level="高级" /> },
  "2026-03-26": { title: "DAY 26", desc: <Course title="NFT市场合约 NFT Marketplace" level="高级" /> },
  "2026-03-27": { title: "DAY 27", desc: <><Course title="质押/定期/活期理财产品合约 YieldFarming Contract" level="高级" /><div className="mt-2 text-white/80 border-t border-white/10 pt-2">20:00 嘉宾分享：Roxy - 热门AI生图模型&prompt</div></>, sticker: 'heart' },
  "2026-03-28": { title: "DAY 28", desc: <Course title="去中心化治理DAO DecentralisedGovernance Contract" level="高级" /> },
  "2026-03-29": { title: "DAY 29", desc: <><Course title="稳定币 StableCoin Contract" level="高级" /><div className="mt-2 text-white/80 border-t border-white/10 pt-2">20:00-22:00 Office Hour 答疑时间</div></>, sticker: 'star' },
  "2026-03-30": { title: "DAY 30", desc: <><div className="font-bold text-white mb-2">Mini交易所</div><Course title="The Final Build: Your Own Mini DEX" level="高级" /></> },
  "2026-03-31": { title: "DAY 31", desc: <div className="font-bold text-white">Hackathon Prep Day 黑客松准备日</div>, sticker: 'sparkles' },
  "2026-04-01": { title: "DAY 32", desc: <div className="font-bold text-white">Hackathon Prep Day 黑客松准备日</div>, sticker: 'sparkles' },
  "2026-04-02": { title: "DAY 33", desc: <div className="font-bold text-white">Hackathon Prep Day 黑客松准备日</div>, sticker: 'sparkles' },
  "2026-04-03": { title: "DAY 34", desc: <div className="font-bold text-white">Hackathon Prep Day 黑客松准备日</div>, sticker: 'sparkles' },
  "2026-04-04": { title: "DAY 35", desc: <div className="font-bold text-white">Hackathon Prep Day 黑客松准备日</div>, sticker: 'sparkles' },
  "2026-04-05": { title: "DAY 36", desc: <div className="font-bold text-white">Hackerthon Demo Day!</div>, sticker: 'trophy' },
};

export default function LearningCalendar() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'daily' | 'monthly'>('daily');

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const getDayContent = (date: Date) => {
    const dateStr = formatDate(date);
    return SCHEDULE[dateStr] || { title: "自由安排", desc: "今天没有特定的学习任务，可以复习之前的知识或自由探索！" };
  };

  const nextDay = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 1);
    setCurrentDate(next);
  };

  const prevDay = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 1);
    setCurrentDate(prev);
  };

  const nextMonth = () => {
    const next = new Date(currentDate);
    next.setMonth(next.getMonth() + 1);
    setCurrentDate(next);
  };

  const prevMonth = () => {
    const prev = new Date(currentDate);
    prev.setMonth(prev.getMonth() - 1);
    setCurrentDate(prev);
  };

  const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];
  const MONTHS = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];

  const renderSticker = (dateStr: string) => {
    const entry = SCHEDULE[dateStr];
    if (!entry || !entry.sticker) return null;

    switch (entry.sticker) {
      case 'heart':
        return <Heart className="w-3 h-3 text-pink-400 fill-pink-400 absolute -top-1 -right-1 drop-shadow-[0_0_4px_rgba(244,114,182,0.8)]" />;
      case 'star':
        return <Star className="w-3 h-3 text-yellow-400 fill-yellow-400 absolute -top-1 -right-1 drop-shadow-[0_0_4px_rgba(250,204,21,0.8)]" />;
      case 'sparkles':
        return <Sparkles className="w-3 h-3 text-purple-400 fill-purple-400 absolute -top-1 -right-1 drop-shadow-[0_0_4px_rgba(192,132,252,0.8)]" />;
      case 'trophy':
        return <Trophy className="w-3 h-3 text-amber-400 fill-amber-400 absolute -top-1 -right-1 drop-shadow-[0_0_4px_rgba(251,191,36,0.8)]" />;
      default:
        return null;
    }
  };

  const renderMonthlyCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dateObj = new Date(year, month, i);
      const dateStr = formatDate(dateObj);
      const isToday = new Date().getDate() === i && new Date().getMonth() === month && new Date().getFullYear() === year;
      const isSelected = currentDate.getDate() === i;
      
      days.push(
        <div key={i} className="relative flex items-center justify-center">
          <button
            onClick={() => {
              setCurrentDate(dateObj);
              setView('daily');
            }}
            className={`w-8 h-8 flex items-center justify-center rounded-full text-sm transition-colors ${
              isSelected 
                ? 'bg-indigo-500 text-white font-bold' 
                : isToday 
                  ? 'bg-white/20 text-white font-bold' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            {i}
          </button>
          {renderSticker(dateStr)}
        </div>
      );
    }

    return (
      <div className="p-6 pt-12">
        <div className="flex items-center justify-between mb-6">
          <button onClick={prevMonth} className="p-1 text-white/70 hover:text-white"><ChevronLeft className="w-5 h-5" /></button>
          <div className="text-white font-medium">{year}年 {MONTHS[month]}</div>
          <button onClick={nextMonth} className="p-1 text-white/70 hover:text-white"><ChevronRight className="w-5 h-5" /></button>
        </div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {WEEKDAYS.map(day => (
            <div key={day} className="w-8 h-8 flex items-center justify-center text-xs text-white/50 font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {days}
        </div>
      </div>
    );
  };

  const renderDailyCalendar = () => {
    const content = getDayContent(currentDate);
    const dateStr = formatDate(currentDate);
    const entry = SCHEDULE[dateStr];

    return (
      <div className="flex flex-col h-full pt-12">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 pb-4 border-b border-white/10">
          <button onClick={prevDay} className="p-1 text-white/70 hover:text-white"><ChevronLeft className="w-5 h-5" /></button>
          <div className="text-white/90 text-sm font-medium">
            {currentDate.getFullYear()}年 {MONTHS[currentDate.getMonth()]}
          </div>
          <button onClick={nextDay} className="p-1 text-white/70 hover:text-white"><ChevronRight className="w-5 h-5" /></button>
        </div>
        
        {/* Big Date */}
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative">
          <div className="absolute top-4 right-6 text-white/40 text-sm font-medium">
            星期{WEEKDAYS[currentDate.getDay()]}
          </div>
          <div className="text-8xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50 mb-8 drop-shadow-lg mt-4">
            {currentDate.getDate()}
          </div>
          
          {/* Content */}
          <div className="w-full bg-white/5 rounded-xl p-5 border border-white/10 backdrop-blur-sm relative z-10">
            {/* Journal Sticker */}
            {entry?.sticker && (
              <div className="absolute -top-6 -right-4 rotate-12 drop-shadow-2xl hover:rotate-6 transition-transform duration-300 z-10">
                {/* Washi tape effect (optional, but adds to the journal feel) */}
                <div className="absolute -top-2 -left-2 w-8 h-3 bg-white/20 backdrop-blur-md -rotate-12 rounded-sm shadow-sm"></div>
                
                {entry.sticker === 'heart' && <Heart className="w-12 h-12 text-pink-400 fill-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.8)]" />}
                {entry.sticker === 'star' && <Star className="w-12 h-12 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]" />}
                {entry.sticker === 'sparkles' && <Sparkles className="w-12 h-12 text-purple-400 fill-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.8)]" />}
                {entry.sticker === 'trophy' && <Trophy className="w-12 h-12 text-amber-400 fill-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" />}
              </div>
            )}

            <h3 className="text-indigo-300 font-medium mb-2 text-sm">{content.title}</h3>
            <div className="text-white/80 text-xs leading-relaxed">{content.desc}</div>
          </div>

          {/* Easter Egg: Astronaut Flipbook */}
          <AstronautFlipbook date={currentDate} />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="group relative">
        <button
          onClick={() => {
            setIsOpen(true);
            setCurrentDate(new Date());
            setView('daily');
          }}
          className="bg-white/10 backdrop-blur-md p-2 lg:p-3 rounded-full border border-white/20 shadow-lg hover:bg-white/20 transition-all hover:scale-110 hover:shadow-purple-500/50"
        >
          <CalendarIcon className="w-5 h-5 lg:w-6 lg:h-6 text-purple-300" />
        </button>
        <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-sm border border-white/10 z-50">
          学习日历
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl overflow-hidden"
            >
              {/* Header Controls */}
              <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
                <button 
                  onClick={() => setView(view === 'daily' ? 'monthly' : 'daily')}
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition-colors"
                  title={view === 'daily' ? '查看月历' : '查看日历'}
                >
                  <CalendarDays className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Content */}
              <div className="min-h-[400px]">
                {view === 'daily' ? renderDailyCalendar() : renderMonthlyCalendar()}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
