import { useEffect, useState } from 'react';

export default function WelcomePopup({ isOpen, onClose, onStartWriting }) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300); // Wait for animation to complete
    };

    const handleStartWriting = () => {
        handleClose();
        onStartWriting();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gradient-to-br from-violet-100 via-purple-50 to-white backdrop-blur-sm z-50 flex items-center justify-center p-3">
            <div className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl w-full max-w-[350px] transform transition-all duration-300 ${
                isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}>
                {/* Header */}
                <div className="text-center px-6 pt-8 pb-6">
                    <div className="text-5xl mb-4">✨</div>
                    <h1 className="text-xl font-bold text-gray-800 mb-3 leading-tight">
                        Welcome to ThoughtSharing!
                    </h1>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        Here, your thoughts truly matter
                    </p>
                </div>

                {/* Content */}
                <div className="px-6 pb-6">
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                            What you can do:
                        </h2>
                        
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <span className="text-xl mt-0.5">✍️</span>
                                <span className="text-gray-700 text-sm leading-relaxed">Write, edit, and delete your thoughts</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-xl mt-0.5">🌍</span>
                                <span className="text-gray-700 text-sm leading-relaxed">Public notes and <span className="inline-block">🔒 Private notes</span></span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-xl mt-0.5">❤️</span>
                                <span className="text-gray-700 text-sm leading-relaxed">Like other users' thoughts</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-xl mt-0.5">🔍</span>
                                <span className="text-gray-700 text-sm leading-relaxed">Search thoughts</span>
                            </li>
                        </ul>

                        {/* Highlight Message Box */}
                        <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-4 mt-6 border border-violet-100">
                            <p className="text-gray-700 text-sm font-medium leading-relaxed text-center">
                                This space is all yours — express freely, stay private when you want, and share when you're ready ✨
                            </p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 pb-6">
                    <button
                        onClick={handleStartWriting}
                        className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white hover:from-violet-600 hover:to-purple-700 font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        ✨ Start Writing
                    </button>
                </div>
            </div>
        </div>
    );
}