import React, { useRef, useState, useCallback, useEffect } from 'react';
import { toPng } from 'html-to-image';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, RefreshCcw, Type, User, Share2, Copy, Twitter, Instagram, ExternalLink, Languages, AlertTriangle, Globe, Compass, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PassData {
  userType: string;
  userIntro: string;
  userNickname: string;
  userSubtitle: string;
  avatarUrl: string | null;
  cardPositionX: number;
  cardPositionY: number;
  cardScale: number;
}

const INITIAL_DATA: PassData = {
  userType: "ONBOARD MEMBERSHIP",
  userIntro: "HerSolidity 6.5 期学员",
  userNickname: "",
  userSubtitle: "",
  avatarUrl: null,
  cardPositionX: 88, // Percentage
  cardPositionY: 100, // Percentage
  cardScale: 0.6,
};

const SOCIAL_HASHTAGS = "#WomenlnWeb3 #WomenWeb3Wave";

const TRANSLATIONS = {
  zh: {
    title: "通行证生成器",
    subtitle: "自定义您的 Solidity Bootcamp 入场通行证。\n开启区块链宇宙探索之旅。",
    userInfo: "挑战者信息",
    profilePhoto: "头像",
    clickToUpload: "点击虚线圆圈上传头像",
    userType: "用户类型",
    introTitle: "身份 / 头衔",
    nickname: "昵称",
    nicknamePlaceholder: "请输入您的昵称，中英文都可以",
    subtitleDesc: "自我介绍",
    subtitlePlaceholder: "请用一句话介绍下自己吧",
    fillRequired: "请填写昵称和自我介绍",
    shareSocial: "分享到社交媒体",
    captionLabel: "文案 (分享时自动复制)",
    shareX: "X / Twitter",
    shareInsta: "Instagram",
    shareXhs: "小红书",
    downloadNote: "注意：请先下载图片，以便在发布时附上。",
    downloadPoster: "下载通行证卡片",
    scanToJoin: "扫码加入",
    uploadPlaceholderTitle: "Solidity\nBootcamp",
    uploadPlaceholderDesc: "上传原始海报以获得最佳效果",
    shareAlert: "文案已复制！正在打开",
    defaultShareText: `来看看我的 Herstory Solidity Bootcamp 入场通行证！🚀\n\n${SOCIAL_HASHTAGS}`,
    browserWarning: "建议使用 Chrome 浏览器以获得最佳效果，其他浏览器可能导致图片生成异常。"
  },
  en: {
    title: "Pass Generator",
    subtitle: "Customize your Solidity Bootcamp onboard pass.\nStart your blockchain universe exploration journey.",
    userInfo: "Challenger Info",
    profilePhoto: "Profile Photo",
    clickToUpload: "Click dashed circle to upload",
    userType: "User Type",
    introTitle: "Identity / Title",
    nickname: "Nickname",
    nicknamePlaceholder: "Enter your nickname (English/Chinese)",
    subtitleDesc: "Self Introduction",
    subtitlePlaceholder: "Introduce yourself in one sentence",
    fillRequired: "Please fill in Nickname and Self Introduction",
    shareSocial: "Share to Social",
    captionLabel: "Caption (Auto-copied on share)",
    shareX: "X / Twitter",
    shareInsta: "Instagram",
    shareXhs: "Xiaohongshu",
    downloadNote: "Note: Download the image first to attach it to your post.",
    downloadPoster: "Download Pass Card",
    scanToJoin: "Scan QR Code\nto Join",
    uploadPlaceholderTitle: "Solidity\nBootcamp",
    uploadPlaceholderDesc: "Upload the original poster for best results",
    shareAlert: "Caption copied! Opening",
    defaultShareText: `Check out my onboard pass for the Solidity Bootcamp! 🚀\n\n${SOCIAL_HASHTAGS}`,
    browserWarning: "Google Chrome is recommended. Other browsers may cause image generation issues."
  }
};

type Lang = 'zh' | 'en';

export default function PassGenerator() {
  const [lang, setLang] = useState<Lang>('zh');
  const [data, setData] = useState<PassData>(INITIAL_DATA);
  const previewRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [shareText, setShareText] = useState(TRANSLATIONS['zh'].defaultShareText);
  const [containerScale, setContainerScale] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        const mobile = width < 1024; // lg breakpoint
        setIsMobile(mobile);

        const padding = 32; // 16px padding on each side
        const targetWidth = 800;
        // On mobile, we scale the card (600px wide) instead of the poster (800px)
        const targetBase = mobile ? 600 : 800;
        const availableWidth = width - padding;
        // Calculate scale, max 1
        const newScale = Math.min(1, availableWidth / targetBase);
        setContainerScale(newScale);
      }
    };

    // Initial calculation
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'zh' ? 'en' : 'zh';
    setLang(newLang);
    // Optionally update share text if it matches the default of the previous language
    if (shareText === TRANSLATIONS[lang].defaultShareText) {
      setShareText(TRANSLATIONS[newLang].defaultShareText);
    }
  };

  const handleDownload = useCallback(async () => {
    if (!data.userNickname.trim() || !data.userSubtitle.trim()) {
      alert(t.fillRequired);
      return;
    }

    if (previewRef.current) {
      setIsDownloading(true);
      try {
        // Wait for fonts to be ready
        await document.fonts.ready;
        
        // Base size is 800x600. pixelRatio: 5 results in 4000x3000 output.
        // cacheBust: true breaks blob: URLs, so we remove it.
        const dataUrl = await toPng(previewRef.current, { 
          pixelRatio: 5,
          skipAutoScale: true
        });
        const link = document.createElement('a');
        link.download = `solidity-bootcamp-pass-${data.userNickname}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to download image', err);
      } finally {
        setIsDownloading(false);
      }
    }
  }, [data, t.fillRequired]);

  const onDropAvatar = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setData(prev => ({ ...prev, avatarUrl: url }));
    }
  }, []);

  const { getRootProps: getAvatarRootProps, getInputProps: getAvatarInputProps } = useDropzone({
    onDrop: onDropAvatar,
    accept: { 'image/*': [] as string[] },
    multiple: false
  } as any);

  const handleShare = async (platform: 'x' | 'instagram' | 'xiaohongshu') => {
    if (!data.userNickname.trim() || !data.userSubtitle.trim()) {
      alert(t.fillRequired);
      return;
    }

    // 1. Auto-download the image first
    await handleDownload();

    let text = shareText;
    let url = '';

    // Platform specific mentions
    if (platform === 'x') {
      text += `\n@HerstoryWeb3`;
      url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    } else if (platform === 'instagram') {
      text += `\n@herstory_web3`;
      url = `https://www.instagram.com/herstory_web3/`;
    } else if (platform === 'xiaohongshu') {
      text += `\n小红书号：HerstoryWeb3`;
      url = `https://www.xiaohongshu.com/`; // No direct web intent
    }

    // Copy text to clipboard
    navigator.clipboard.writeText(text).then(() => {
      // Small delay to allow the download to start/finish visually
      setTimeout(() => {
        alert(`${t.shareAlert} ${platform === 'x' ? 'X (Twitter)' : platform === 'xiaohongshu' ? 'Xiaohongshu' : 'Instagram'}...`);
        window.open(url, '_blank');
      }, 500);
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-slate-900 font-sans flex flex-col lg:flex-row overflow-x-hidden">
      {/* Sidebar Controls */}
      <div className="w-full lg:w-[400px] bg-white/95 backdrop-blur-md border-b lg:border-r border-white/10 p-6 flex flex-col gap-8 lg:h-screen lg:overflow-y-auto shadow-2xl z-20 relative shrink-0">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent mb-2 font-serif uppercase tracking-tighter">{t.title}</h1>
            <p className="text-sm text-slate-500 whitespace-pre-line leading-relaxed font-medium">{t.subtitle}</p>
          </div>
          <button 
            onClick={toggleLang}
            className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-xs font-medium transition-colors"
          >
            <Languages className="w-3 h-3" />
            {lang === 'zh' ? 'EN' : '中文'}
          </button>
        </div>

        {/* Browser Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
          <p>{t.browserWarning}</p>
        </div>

        {/* User Info Inputs */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <User className="w-4 h-4" /> {t.userInfo}
          </h2>
          
          {/* Avatar Upload */}
          <div className="flex items-center gap-4">
            <div {...getAvatarRootProps()} className="w-16 h-16 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-indigo-500 overflow-hidden relative group shrink-0">
              <input {...getAvatarInputProps()} />
              {data.avatarUrl ? (
                <img src={data.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-slate-400 group-hover:text-indigo-500" />
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="text-xs text-slate-500">
              <p className="font-medium text-slate-700">{t.profilePhoto}</p>
              <p>{t.clickToUpload}</p>
            </div>
          </div>

          <div className="space-y-3">
            {/* User Type Input Removed - Fixed to ONBOARD MEMBERSHIP */}
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t.introTitle}</label>
              <input 
                type="text" 
                value={data.userIntro}
                onChange={(e) => setData(prev => ({ ...prev, userIntro: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                {t.nickname} <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={data.userNickname}
                onChange={(e) => setData(prev => ({ ...prev, userNickname: e.target.value }))}
                placeholder={t.nicknamePlaceholder}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-300"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">
                {t.subtitleDesc} <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={data.userSubtitle}
                onChange={(e) => setData(prev => ({ ...prev, userSubtitle: e.target.value }))}
                placeholder={t.subtitlePlaceholder}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Positioning Section Removed - Fixed Layout */}

        {/* Social Share */}
        <div className="space-y-3 border-t border-slate-100 pt-4">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Share2 className="w-4 h-4" /> {t.shareSocial}
          </h2>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">{t.captionLabel}</label>
            <textarea 
              value={shareText}
              onChange={(e) => setShareText(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button 
              onClick={() => handleShare('x')}
              className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-black text-white hover:bg-slate-800 transition-colors"
            >
              <Twitter className="w-4 h-4" />
              <span className="text-[10px] font-medium">{t.shareX}</span>
            </button>
            <button 
              onClick={() => handleShare('instagram')}
              className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white hover:opacity-90 transition-opacity"
            >
              <Instagram className="w-4 h-4" />
              <span className="text-[10px] font-medium">{t.shareInsta}</span>
            </button>
            <button 
              onClick={() => handleShare('xiaohongshu')}
              className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
            >
              <span className="font-bold text-sm">红</span>
              <span className="text-[10px] font-medium">{t.shareXhs}</span>
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            {t.downloadNote}
          </p>
        </div>

        <div className="pt-2 mt-auto">
          <button 
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDownloading ? (
              <RefreshCcw className="w-5 h-5 animate-spin" />
            ) : (
              <Download className="w-5 h-5" />
            )}
            {t.downloadPoster}
          </button>
        </div>
      </div>

      {/* Preview Area */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 relative z-10 min-h-[400px] lg:min-h-0">
        {/* Cosmic background effect for the preview area container */}
        <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center opacity-20 blur-3xl pointer-events-none"></div>

        {/* Floating Action Buttons */}
        <div className={`absolute top-4 right-4 lg:top-6 lg:right-6 z-50 flex items-center gap-2 lg:gap-4 ${isMobile ? 'flex-row' : ''}`}>
          {/* Rocket: Learning Guide */}
          <a 
            href="https://foroneice.github.io/web3-solidity-guide-cn/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative"
          >
            <div className="bg-white/10 backdrop-blur-md p-2 lg:p-3 rounded-full border border-white/20 shadow-lg hover:bg-white/20 transition-all hover:scale-110 hover:shadow-orange-500/50">
              <Rocket className="w-5 h-5 lg:w-6 lg:h-6 text-orange-300" />
            </div>
            {/* Tooltip */}
            <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-sm border border-white/10 z-50">
              查看Solidity中文学习指南
            </div>
          </a>

          {/* Compass: Challenge Calendar */}
          <a 
            href="https://www.web3compass.xyz/challenge-calendar" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative"
          >
            <div className="bg-white/10 backdrop-blur-md p-2 lg:p-3 rounded-full border border-white/20 shadow-lg hover:bg-white/20 transition-all hover:scale-110 hover:shadow-cyan-500/50">
              <Compass className="w-5 h-5 lg:w-6 lg:h-6 text-cyan-300" />
            </div>
            {/* Tooltip */}
            <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-sm border border-white/10 z-50">
              解锁30天 Solidity 挑战日历
            </div>
          </a>

          {/* Globe: Herstory */}
          <a 
            href="https://herstory.framer.ai/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative"
          >
            <div className="bg-white/10 backdrop-blur-md p-2 lg:p-3 rounded-full border border-white/20 shadow-lg hover:bg-white/20 transition-all hover:scale-110 hover:shadow-indigo-500/50">
              <Globe className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-300" />
            </div>
            {/* Tooltip */}
            <div className="absolute top-full right-0 mt-2 px-3 py-1.5 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-sm border border-white/10 z-50">
              版权所有 © 2026 Herstory
            </div>
          </a>
        </div>

        {/* Credits */}
        <div className={`absolute bottom-4 right-4 lg:bottom-6 lg:right-6 z-50 flex gap-2 lg:gap-4 ${isMobile ? 'flex-row' : ''}`}>
          {/* Design by Roxy */}
          <a 
            href="https://mp.weixin.qq.com/s/04xF5hlwrXjyrEJ2vttPOA" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative"
          >
            <div className="bg-white/10 backdrop-blur-md p-2 lg:p-3 rounded-full border border-white/20 shadow-lg hover:bg-white/20 transition-all hover:scale-110 hover:shadow-pink-500/50 flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12">
              <span className="text-lg lg:text-xl" role="img" aria-label="astronaut">👩‍🚀</span>
            </div>
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-sm border border-white/10 z-50">
              Hi! I'm Designer Roxy.
            </div>
          </a>

          {/* Developed by Ice */}
          <a 
            href="https://github.com/ForOneIce" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group relative"
          >
            <div className="bg-white/10 backdrop-blur-md p-2 lg:p-3 rounded-full border border-white/20 shadow-lg hover:bg-white/20 transition-all hover:scale-110 hover:shadow-blue-500/50 flex items-center justify-center w-10 h-10 lg:w-12 lg:h-12">
              <span className="text-lg lg:text-xl" role="img" aria-label="astronaut">👨‍🚀</span>
            </div>
            <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none backdrop-blur-sm border border-white/10 z-50">
              Hi~ I'm Dev Ice.
            </div>
          </a>
        </div>

        {/* MOBILE VIEW: Only show the TicketCard */}
        {isMobile && (
          <div 
            className="relative z-20 transition-transform duration-300 ease-out origin-center"
            style={{ 
              transform: `scale(${containerScale})`,
              width: '600px', 
              height: '220px' 
            }}
          >
            <TicketCard data={data} t={t} />
          </div>
        )}

        {/* DESKTOP VIEW / GENERATION TARGET: Full Poster */}
        {/* On mobile, we hide this visually but keep it in DOM for generation */}
        <div 
          className={`relative z-10 transition-transform duration-300 ease-out origin-center ${isMobile ? 'fixed -left-[9999px] pointer-events-none opacity-0' : ''}`}
          style={{ 
            transform: `scale(${isMobile ? 1 : containerScale})`, // Reset scale on mobile since it's hidden/offscreen
            width: '800px', 
            height: '600px' 
          }}
        >
          <div className="relative shadow-2xl overflow-hidden bg-black ring-8 ring-white/10 rounded-xl w-full h-full">
               {/* This is the capture area */}
               <div 
                  ref={previewRef}
                  className="w-full h-full relative bg-black"
               >
                  {/* Background Layer - Using img tag for better html-to-image support */}
                  <img 
                    src="/bg.jpg" 
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    alt="Background"
                    crossOrigin="anonymous"
                  />

                  {/* The Card */}
                  <div 
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 origin-center"
                    style={{
                      left: `${data.cardPositionX}%`,
                      top: `${data.cardPositionY}%`,
                      transform: `translate(-50%, -50%) scale(${data.cardScale})`,
                    }}
                  >
                    <TicketCard data={data} t={t} />
                  </div>
               </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TicketCard({ data, t }: { data: PassData, t: any }) {
  return (
    <div 
      className="w-[600px] h-[220px] bg-white/95 backdrop-blur-sm shadow-2xl flex relative overflow-hidden"
      style={{
        borderRadius: '24px',
        // CSS Mask for the "ticket" shape (inward circles at top and bottom of the divider)
        // We use standard mask-image. The transparent parts create the holes.
        maskImage: `radial-gradient(circle at 432px 0, transparent 12px, black 13px), 
                    radial-gradient(circle at 432px 100%, transparent 12px, black 13px)`,
        WebkitMaskImage: `radial-gradient(circle at 432px 0, transparent 12px, black 13px), 
                          radial-gradient(circle at 432px 100%, transparent 12px, black 13px)`,
      }}
    >
      {/* Left/Main Section */}
      <div className="flex-1 p-6 flex items-center gap-6 relative z-10 pl-10">
        
        {/* Avatar Ring */}
        <div className="relative shrink-0">
          <div className="w-32 h-32 rounded-full p-[5px] bg-[conic-gradient(from_0deg,#22d3ee,#e879f9,#fde047,#22d3ee)] shadow-xl">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-200 border-[4px] border-white relative">
              {data.avatarUrl ? (
                <img src={data.avatarUrl} alt="User" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-300">
                  <User className="w-12 h-12" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col justify-center space-y-1">
          <h3 className="font-serif font-bold text-[#2e1065] text-lg tracking-wide uppercase opacity-90">
            {data.userType}
          </h3>
          <p className="font-serif text-slate-700 text-lg italic font-medium">
            {data.userIntro}
          </p>
          <h2 className="font-serif font-black text-[#0f172a] text-5xl tracking-tight leading-tight">
            {data.userNickname || "Bala"}
          </h2>
          <p className="font-sans text-slate-500 text-xs font-bold tracking-widest uppercase mt-2">
            {data.userSubtitle || "Herstory女性社区发起人"}
          </p>
        </div>
      </div>

      {/* Divider Line (Visual only, positioned at 432px approx) */}
      <div className="absolute left-[432px] top-4 bottom-4 border-l-2 border-dashed border-slate-300/50 -ml-[1px]"></div>

      {/* Right/QR Section */}
      <div className="w-[168px] bg-slate-50/30 p-4 flex flex-col items-center justify-center gap-3 relative z-10">
        <p className="font-serif text-[10px] font-bold tracking-widest text-slate-500 text-center uppercase leading-tight whitespace-pre-line">
          {t.scanToJoin}
        </p>
        <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <img src="/QR.jpg" alt="QR Code" className="w-[100px] h-[100px] object-contain" />
        </div>
      </div>

      {/* Decorative texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none mix-blend-overlay"></div>
    </div>
  );
}
