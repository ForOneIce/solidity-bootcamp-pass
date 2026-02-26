import React, { useRef, useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, Type, User, Share2, Copy, Twitter, Instagram, ExternalLink, Languages, AlertTriangle } from 'lucide-react';
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
  userIntro: "AI Edgelab founder",
  userNickname: "Rebecca",
  userSubtitle: "AI/web3公益技术顾问",
  avatarUrl: null,
  cardPositionX: 88, // Percentage
  cardPositionY: 100, // Percentage
  cardScale: 0.6,
};

const SOCIAL_HASHTAGS = "#WomenlnWeb3 #WomenWeb3Wave";

const TRANSLATIONS = {
  zh: {
    title: "通行证生成器",
    subtitle: "自定义您的 Solidity Bootcamp 入场通行证。",
    userInfo: "用户信息",
    profilePhoto: "头像",
    clickToUpload: "点击上传",
    userType: "用户类型",
    introTitle: "介绍 / 头衔",
    nickname: "昵称",
    subtitleDesc: "副标题 / 描述",
    shareSocial: "分享到社交媒体",
    captionLabel: "文案 (分享时自动复制)",
    shareX: "X / Twitter",
    shareInsta: "Instagram",
    shareXhs: "小红书",
    downloadNote: "注意：请先下载图片，以便在发布时附上。",
    downloadPoster: "下载海报",
    scanToJoin: "扫码加入",
    uploadPlaceholderTitle: "Solidity\nBootcamp",
    uploadPlaceholderDesc: "上传原始海报以获得最佳效果",
    shareAlert: "文案已复制！正在打开",
    defaultShareText: `来看看我的 Herstory Solidity Bootcamp 入场通行证！🚀\n\n${SOCIAL_HASHTAGS}`,
    browserWarning: "建议使用 Chrome 浏览器以获得最佳效果，其他浏览器可能导致图片生成异常。"
  },
  en: {
    title: "Pass Generator",
    subtitle: "Customize your Solidity Bootcamp onboard pass.",
    userInfo: "User Info",
    profilePhoto: "Profile Photo",
    clickToUpload: "Click to upload",
    userType: "User Type",
    introTitle: "Intro / Title",
    nickname: "Nickname",
    subtitleDesc: "Subtitle / Description",
    shareSocial: "Share to Social",
    captionLabel: "Caption (Auto-copied on share)",
    shareX: "X / Twitter",
    shareInsta: "Instagram",
    shareXhs: "Xiaohongshu",
    downloadNote: "Note: Download the image first to attach it to your post.",
    downloadPoster: "Download Poster",
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

  const t = TRANSLATIONS[lang];

  const toggleLang = () => {
    const newLang = lang === 'zh' ? 'en' : 'zh';
    setLang(newLang);
    // Optionally update share text if it matches the default of the previous language
    if (shareText === TRANSLATIONS[lang].defaultShareText) {
      setShareText(TRANSLATIONS[newLang].defaultShareText);
    }
  };

  const handleDownload = useCallback(async () => {
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
  }, [data.userNickname]);

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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col md:flex-row">
      {/* Sidebar Controls */}
      <div className="w-full md:w-[400px] bg-white border-r border-slate-200 p-6 flex flex-col gap-8 overflow-y-auto h-screen shadow-xl z-10">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2 font-serif">{t.title}</h1>
            <p className="text-sm text-slate-500">{t.subtitle}</p>
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
            <div {...getAvatarRootProps()} className="w-16 h-16 rounded-full bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:border-indigo-500 overflow-hidden relative group">
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
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t.nickname}</label>
              <input 
                type="text" 
                value={data.userNickname}
                onChange={(e) => setData(prev => ({ ...prev, userNickname: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t.subtitleDesc}</label>
              <input 
                type="text" 
                value={data.userSubtitle}
                onChange={(e) => setData(prev => ({ ...prev, userSubtitle: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
      <div className="flex-1 bg-slate-100 overflow-auto flex items-center justify-center p-8">
        <div className="relative shadow-2xl overflow-hidden bg-black" style={{ width: '800px', height: '600px' }}>
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
            {data.userNickname}
          </h2>
          <p className="font-sans text-slate-500 text-xs font-bold tracking-widest uppercase mt-2">
            {data.userSubtitle}
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
