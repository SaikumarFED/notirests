'use client';

import { ArrowRight } from 'lucide-react';

export function DatabasePreview() {
  const sampleData = [
    { name: 'Website Redesign', status: 'In Progress', priority: 'High', dueDate: '2024-05-15' },
    { name: 'API Integration', status: 'Done', priority: 'Critical', dueDate: '2024-04-20' },
    { name: 'Mobile App', status: 'Planned', priority: 'Medium', dueDate: '2024-06-30' },
    { name: 'Documentation', status: 'In Progress', priority: 'Low', dueDate: '2024-05-01' },
    { name: 'Performance Audit', status: 'Planned', priority: 'High', dueDate: '2024-05-25' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Done':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Planned':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'text-red-600 font-semibold';
      case 'High':
        return 'text-orange-600 font-semibold';
      case 'Medium':
        return 'text-blue-600';
      case 'Low':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      <div className="bg-gradient-to-r from-primary/5 to-transparent px-6 py-4 border-b border-border">
        <h3 className="text-lg font-bold text-foreground">Sample Notion Database</h3>
        <p className="text-sm text-muted-foreground mt-1">Your data becomes a REST API instantly</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary">
              <th className="text-left px-6 py-3 font-semibold text-foreground">Task Name</th>
              <th className="text-left px-6 py-3 font-semibold text-foreground">Status</th>
              <th className="text-left px-6 py-3 font-semibold text-foreground">Priority</th>
              <th className="text-left px-6 py-3 font-semibold text-foreground">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {sampleData.map((row, idx) => (
              <tr key={idx} className="border-b border-border hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4 font-medium text-foreground">{row.name}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className={`px-6 py-4 text-sm ${getPriorityColor(row.priority)}`}>{row.priority}</td>
                <td className="px-6 py-4 text-muted-foreground">{row.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-secondary/30 border-t border-border flex items-center justify-between">
        <p className="text-sm text-muted-foreground">5 rows • 4 columns</p>
        <div className="flex items-center text-primary font-semibold text-sm cursor-pointer hover:gap-2 transition-all">
          Explore API <ArrowRight className="w-4 h-4 ml-2" />
        </div>
      </div>
    </div>
  );
}
