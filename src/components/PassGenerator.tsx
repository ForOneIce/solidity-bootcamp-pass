import React, { useRef, useState, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { QRCodeSVG } from 'qrcode.react';
import { useDropzone } from 'react-dropzone';
import { Upload, Download, RefreshCcw, Image as ImageIcon, Type, QrCode, User, Settings, Share2, Copy, Twitter, Instagram, ExternalLink, Languages } from 'lucide-react';
import { cn } from '@/lib/utils';

// Default placeholder image for background (simulating the space theme)
const DEFAULT_BG = "linear-gradient(135deg, #2e1065 0%, #4c1d95 50%, #db2777 100%)";

// Simple SVG data URI for the "NINO" logo in the QR code
const NINO_LOGO = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 40 20' width='40' height='20'%3E%3Crect width='40' height='20' rx='4' fill='%231a103c'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='white' font-family='sans-serif' font-weight='bold' font-size='10'%3ENINO%3C/text%3E%3C/svg%3E";

interface PassData {
  userType: string;
  userIntro: string;
  userNickname: string;
  userSubtitle: string;
  qrUrl: string;
  avatarUrl: string | null;
  backgroundUrl: string | null;
  cardPositionX: number;
  cardPositionY: number;
  cardScale: number;
}

const INITIAL_DATA: PassData = {
  userType: "FEATURED GUEST",
  userIntro: "AI Edgelab founder",
  userNickname: "Rebecca",
  userSubtitle: "AI/web3公益技术顾问",
  qrUrl: "https://herstory.framer.ai/",
  avatarUrl: null,
  backgroundUrl: null,
  cardPositionX: 100, // Percentage
  cardPositionY: 88, // Percentage
  cardScale: 0.7,
};

const SOCIAL_HASHTAGS = "#WomenlnWeb3 #WomenWeb3Wave";

const TRANSLATIONS = {
  zh: {
    title: "通行证生成器",
    subtitle: "自定义您的 Solidity Bootcamp 入场通行证。",
    background: "背景图片",
    uploadTemplate: "上传海报模板",
    uploadTip: "提示：上传“Solidity Bootcamp”海报图片作为背景。",
    resetBackground: "重置背景",
    userInfo: "用户信息",
    profilePhoto: "头像",
    clickToUpload: "点击上传",
    userType: "用户类型",
    introTitle: "介绍 / 头衔",
    nickname: "昵称",
    subtitleDesc: "副标题 / 描述",
    qrCode: "二维码",
    targetUrl: "目标链接",
    layoutAdjustment: "布局调整",
    resetLayout: "重置布局",
    verticalPos: "垂直位置",
    horizontalPos: "水平位置",
    scale: "缩放",
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
    defaultShareText: `来看看我的 Solidity Bootcamp 入场通行证！🚀\n\n${SOCIAL_HASHTAGS}`
  },
  en: {
    title: "Pass Generator",
    subtitle: "Customize your Solidity Bootcamp onboard pass.",
    background: "Background",
    uploadTemplate: "Upload Poster Template",
    uploadTip: "Tip: Upload the \"Solidity Bootcamp\" poster image to use as the background.",
    resetBackground: "Reset Background",
    userInfo: "User Info",
    profilePhoto: "Profile Photo",
    clickToUpload: "Click to upload",
    userType: "User Type",
    introTitle: "Intro / Title",
    nickname: "Nickname",
    subtitleDesc: "Subtitle / Description",
    qrCode: "QR Code",
    targetUrl: "Target URL",
    layoutAdjustment: "Layout Adjustment",
    resetLayout: "Reset Layout",
    verticalPos: "Vertical Position",
    horizontalPos: "Horizontal Position",
    scale: "Scale",
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
    defaultShareText: `Check out my onboard pass for the Solidity Bootcamp! 🚀\n\n${SOCIAL_HASHTAGS}`
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
        const dataUrl = await toPng(previewRef.current, { cacheBust: true, pixelRatio: 2 });
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

  const onDropBackground = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setData(prev => ({ ...prev, backgroundUrl: url }));
    }
  }, []);

  const { getRootProps: getAvatarRootProps, getInputProps: getAvatarInputProps } = useDropzone({
    onDrop: onDropAvatar,
    accept: { 'image/*': [] as string[] },
    multiple: false
  } as any);

  const { getRootProps: getBgRootProps, getInputProps: getBgInputProps } = useDropzone({
    onDrop: onDropBackground,
    accept: { 'image/*': [] as string[] },
    multiple: false
  } as any);

  const resetPosition = () => {
    setData(prev => ({
      ...prev,
      cardPositionX: 50,
      cardPositionY: 80,
      cardScale: 1
    }));
  };

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

        {/* Background Upload */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <ImageIcon className="w-4 h-4" /> {t.background}
          </h2>
          <div {...getBgRootProps()} className="border-2 border-dashed border-slate-300 rounded-xl p-4 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors group">
            <input {...getBgInputProps()} />
            <div className="flex flex-col items-center gap-2 text-slate-500 group-hover:text-indigo-600">
              <Upload className="w-6 h-6" />
              <span className="text-xs font-medium">{t.uploadTemplate}</span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 px-1">
            {t.uploadTip}
          </p>
          {data.backgroundUrl && (
             <button 
               onClick={() => setData(prev => ({ ...prev, backgroundUrl: null }))}
               className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
             >
               <RefreshCcw className="w-3 h-3" /> {t.resetBackground}
             </button>
          )}
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
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">{t.userType}</label>
              <input 
                type="text" 
                value={data.userType}
                onChange={(e) => setData(prev => ({ ...prev, userType: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
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

        {/* QR Code */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <QrCode className="w-4 h-4" /> {t.qrCode}
          </h2>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">{t.targetUrl}</label>
            <input 
              type="text" 
              value={data.qrUrl}
              onChange={(e) => setData(prev => ({ ...prev, qrUrl: e.target.value }))}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Positioning */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Settings className="w-4 h-4" /> {t.layoutAdjustment}
            </h2>
            <button 
              onClick={resetPosition}
              className="text-[10px] text-indigo-600 hover:text-indigo-800 font-medium bg-indigo-50 px-2 py-1 rounded"
            >
              {t.resetLayout}
            </button>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block flex justify-between">
              <span>{t.verticalPos}</span>
              <span>{data.cardPositionY}%</span>
            </label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={data.cardPositionY}
              onChange={(e) => setData(prev => ({ ...prev, cardPositionY: parseInt(e.target.value) }))}
              className="w-full accent-indigo-600"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block flex justify-between">
              <span>{t.horizontalPos}</span>
              <span>{data.cardPositionX}%</span>
            </label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={data.cardPositionX}
              onChange={(e) => setData(prev => ({ ...prev, cardPositionX: parseInt(e.target.value) }))}
              className="w-full accent-indigo-600"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block flex justify-between">
              <span>{t.scale}</span>
              <span>{data.cardScale.toFixed(1)}x</span>
            </label>
            <input 
              type="range" 
              min="0.5" 
              max="2" 
              step="0.1"
              value={data.cardScale}
              onChange={(e) => setData(prev => ({ ...prev, cardScale: parseFloat(e.target.value) }))}
              className="w-full accent-indigo-600"
            />
          </div>
        </div>

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
                className="w-full h-full relative"
                style={{
                  background: data.backgroundUrl ? `url(${data.backgroundUrl})` : DEFAULT_BG,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
             >
                {/* Fallback content if no background is uploaded */}
                {!data.backgroundUrl && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
                    <div className="text-center text-white/20">
                      <h1 className="text-6xl font-black font-serif mb-4 whitespace-pre-line">{t.uploadPlaceholderTitle}</h1>
                      <p className="text-xl">{t.uploadPlaceholderDesc}</p>
                    </div>
                    {/* Decorative stars */}
                    <div className="absolute top-10 left-10 w-2 h-2 bg-white rounded-full opacity-50 animate-pulse"></div>
                    <div className="absolute top-20 right-40 w-3 h-3 bg-pink-400 rounded-full opacity-60"></div>
                    <div className="absolute bottom-40 left-20 w-4 h-4 bg-yellow-300 rounded-full opacity-40"></div>
                  </div>
                )}

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
        <div className="bg-white p-2 rounded-xl shadow-sm border border-slate-100">
          <QRCodeSVG 
            value={data.qrUrl} 
            size={100}
            level="H"
            fgColor="#1a103c"
            imageSettings={{
              src: NINO_LOGO,
              x: undefined,
              y: undefined,
              height: 20,
              width: 30,
              excavate: true,
            }}
          />
        </div>
      </div>

      {/* Decorative texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none mix-blend-overlay"></div>
    </div>
  );
}
