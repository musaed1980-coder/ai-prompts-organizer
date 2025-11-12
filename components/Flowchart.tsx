
import React from 'react';

export const Flowchart = () => {
    return (
        <div className="p-4 bg-gray-50 rounded-lg my-4 overflow-x-auto">
            <svg width="100%" viewBox="0 0 800 400" xmlns="http://www.w3.org/2000/svg" className="min-w-[700px]">
                {/* Definitions */}
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#6b7280" />
                    </marker>
                    <style>
                        {`
                            .flow-box { fill: #fff; stroke: #cbd5e1; stroke-width: 1.5; }
                            .flow-text { font-size: 14px; font-family: 'Tajawal', sans-serif; fill: #1f2937; text-anchor: middle; direction: rtl; }
                            .flow-line { stroke: #6b7280; stroke-width: 1.5; marker-end: url(#arrowhead); }
                            .flow-label { font-size: 12px; fill: #4b5563; font-family: 'Tajawal', sans-serif; text-anchor: middle; }
                        `}
                    </style>
                </defs>

                {/* Nodes */}
                <g>
                    <rect x="325" y="20" width="150" height="60" rx="10" className="flow-box" />
                    <text x="400" y="55" className="flow-text">إضافة موقع/أداة جديدة</text>
                </g>
                <g>
                    <rect x="550" y="150" width="150" height="60" rx="10" className="flow-box" />
                    <text x="625" y="185" className="flow-text">البحث والتصفية</text>
                </g>
                <g>
                    <rect x="325" y="150" width="150" height="60" rx="10" className="flow-box" />
                    <text x="400" y="185" className="flow-text">إدارة البرومبتات</text>
                </g>
                <g>
                    <rect x="100" y="150" width="150" height="60" rx="10" className="flow-box" />
                    <text x="175" y="185" className="flow-text">عرض وتعديل الأداة</text>
                </g>
                <g>
                    <rect x="325" y="300" width="150" height="60" rx="10" className="flow-box" />
                    <text x="400" y="335" className="flow-text">التقييم والملاحظات</text>
                </g>

                {/* Lines */}
                <path d="M 400 80 Q 400 115 175 145" className="flow-line" fill="none" />
                <path d="M 400 80 Q 400 115 400 145" className="flow-line" fill="none" />
                <path d="M 400 80 Q 400 115 625 145" className="flow-line" fill="none" />
                
                <path d="M 175 210 Q 175 255 350 295" className="flow-line" fill="none" />
                <path d="M 400 210 V 295" className="flow-line" fill="none" />
                <path d="M 625 210 Q 625 255 450 295" className="flow-line" fill="none" />
                
                {/* Labels */}
                <text x="280" y="125" className="flow-label">حفظ</text>
                <text x="520" y="125" className="flow-label">تصفح</text>
                <text x="280" y="270" className="flow-label">تقييم</text>
                <text x="520" y="270" className="flow-label">تقييم</text>
            </svg>
        </div>
    );
};
