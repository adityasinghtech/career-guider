import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, User, FileText, Globe } from "lucide-react";

interface CareerReportPDFProps {
  analysis: any;
  studentName: string;
  studentClass: string;
  studentStream: string;
}

const CareerReportPDF: React.FC<CareerReportPDFProps> = ({ 
  analysis, 
  studentName, 
  studentClass, 
  studentStream 
}) => {
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div 
      id="career-report-pdf" 
      className="bg-white text-black p-10 max-w-[800px] mx-auto font-sans leading-relaxed"
      style={{ minHeight: '1120px' }}
    >
      {/* Header Section */}
      <div className="border-b-4 border-primary pb-6 mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-1">PathFinder AI</h1>
          <p className="text-sm tracking-widest text-muted-foreground uppercase">Deep Career Analysis Report</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-semibold flex items-center justify-end gap-1"><Calendar className="w-4 h-4" /> {currentDate}</p>
          <p className="text-xs text-muted-foreground">Report ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
        </div>
      </div>

      {/* Student Details Card */}
      <div className="bg-slate-50 border rounded-2xl p-6 mb-8 grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1"><User className="w-3 h-3" /> Student Name</p>
          <p className="text-lg font-bold">{studentName || 'Learner'}</p>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1"><Globe className="w-3 h-3" /> Education Context</p>
          <p className="text-lg font-bold capitalize">{studentStream} - Class {studentClass || 'N/A'}</p>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="space-y-8">
        {/* 1. Psychological Aptitude */}
        <section>
          <h2 className="text-xl font-bold text-primary mb-3 flex items-center gap-2 border-b pb-1">
            <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
            Psychological Aptitude & Learning Profile
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-bold">Strengths:</p>
              <div className="flex flex-wrap gap-1">
                {analysis.psychological_aptitude.strengths.map((s: string, i: number) => (
                  <span key={i} className="text-xs bg-primary/10 px-2 py-0.5 rounded border border-primary/20">{s}</span>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold">Learning Style:</p>
              <p className="text-xs text-slate-700">{analysis.psychological_aptitude.learning_style}</p>
            </div>
          </div>
          <p className="text-xs mt-3 italic text-slate-500">
            <strong>Career Personality:</strong> {analysis.psychological_aptitude.career_personality}
          </p>
        </section>

        {/* 2. Top Career Tracks */}
        <section>
          <h2 className="text-xl font-bold text-primary mb-3 flex items-center gap-2 border-b pb-1">
            <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
            Top Career Recommendations
          </h2>
          <div className="space-y-3">
            {analysis.top_careers.map((c: any, i: number) => (
              <div key={i} className="border rounded-xl p-4 bg-white shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg">{c.title}</h3>
                  <div className="flex gap-2">
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">{c.salary}</span>
                    <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold capitalize">{c.demand} Demand</span>
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed"><span className="font-bold">Pathway:</span> {c.path}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Financial Plan */}
        <section>
          <h2 className="text-xl font-bold text-primary mb-3 flex items-center gap-2 border-b pb-1">
            <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
            Financial Feasibility & ROI
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <Card className="shadow-none border p-3">
              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Total Savings/Cost</p>
              <p className="text-md font-bold text-primary">{analysis.financial_feasibility.estimated_4year_cost}</p>
            </Card>
            <Card className="shadow-none border p-3">
              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Scholarships</p>
              <p className="text-xs font-semibold">{analysis.financial_feasibility.scholarship_potential}</p>
            </Card>
            <Card className="shadow-none border p-3">
              <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">ROI Timeline</p>
              <p className="text-xs font-semibold">{analysis.financial_feasibility.roi_timeline}</p>
            </Card>
          </div>
        </section>

        {/* 4. Structured Roadmap */}
        <section className="page-break-before">
          <h2 className="text-xl font-bold text-primary mb-3 flex items-center gap-2 border-b pb-1">
            <span className="bg-primary text-white w-6 h-6 rounded-full flex items-center justify-center text-xs">4</span>
            Your 5-Year Roadmap
          </h2>
          <div className="space-y-4">
            {Object.entries(analysis.structured_roadmap).map(([key, items]: [string, any]) => (
              <div key={key} className="relative pl-6 border-l-2 border-primary/20 pb-2">
                <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white"></div>
                <h4 className="text-sm font-bold text-primary mb-2 capitalize">{key.replace('year', 'Year ')}</h4>
                <ul className="grid grid-cols-2 gap-x-6 gap-y-1">
                  {(items as string[]).map((item, idx) => (
                    <li key={idx} className="text-[11px] list-disc ml-4 text-slate-700">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Footer info */}
        <div className="mt-12 pt-6 border-t text-center space-y-2">
          <p className="text-sm font-bold text-slate-800 underline decoration-primary decoration-2">Next Step: Consult an Expert Counselor</p>
          <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} PathFinder AI. Generated via pathfinder-india.com</p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          #career-report-pdf { width: 100% !important; margin: 0 !important; padding: 20px !important; }
          .page-break-before { page-break-before: always; }
        }
      ` }} />
    </div>
  );
};

export default CareerReportPDF;
