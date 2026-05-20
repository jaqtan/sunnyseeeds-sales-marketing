import React, { useState } from 'react';
import { CheckCircle, Circle, Clock, AlertCircle, ChevronDown, ChevronRight } from 'lucide-react';

type Status = 'todo' | 'in_progress' | 'done' | 'blocked';

interface WorkflowTask {
  id: string;
  title: string;
  owner: string;
  dueDate: string;
  status: Status;
  priority: 'high' | 'medium' | 'low';
  program?: string;
}

interface WorkflowStage {
  id: string;
  name: string;
  color: string;
  tasks: WorkflowTask[];
}

const STATUS_CONFIG: Record<Status, { label: string; icon: React.ReactNode; bg: string; text: string }> = {
  todo: { label: 'To Do', icon: <Circle size={14} />, bg: 'bg-gray-100', text: 'text-gray-600' },
  in_progress: { label: 'In Progress', icon: <Clock size={14} />, bg: 'bg-blue-100', text: 'text-blue-700' },
  done: { label: 'Done', icon: <CheckCircle size={14} />, bg: 'bg-green-100', text: 'text-green-700' },
  blocked: { label: 'Blocked', icon: <AlertCircle size={14} />, bg: 'bg-red-100', text: 'text-red-600' },
};

const PRIORITY_COLORS = { high: 'text-red-500', medium: 'text-amber-500', low: 'text-gray-400' };

const DEFAULT_WORKFLOW: WorkflowStage[] = [
  {
    id: 'lead-capture', name: 'Lead Capture', color: '#f59e0b',
    tasks: [
      { id: '1', title: 'Update website inquiry form with program-specific questions', owner: 'Marketing', dueDate: 'Jun 1', status: 'in_progress', priority: 'high', program: 'All' },
      { id: '2', title: 'Launch paid social media campaign for Preschool intake', owner: 'Marketing', dueDate: 'May 28', status: 'todo', priority: 'high', program: 'Preschool' },
      { id: '3', title: 'Set up referral partner agreements with 3 new preschools', owner: 'Sales', dueDate: 'Jun 15', status: 'in_progress', priority: 'medium', program: 'All' },
      { id: '4', title: 'Configure CRM lead scoring for inquiry source tracking', owner: 'Marketing', dueDate: 'May 30', status: 'todo', priority: 'medium', program: 'All' },
    ],
  },
  {
    id: 'tour-interview', name: 'Tour / Interview', color: '#6366f1',
    tasks: [
      { id: '5', title: 'Schedule and confirm school tour calendar for June', owner: 'Admin', dueDate: 'May 25', status: 'done', priority: 'high', program: 'All' },
      { id: '6', title: 'Create tour follow-up email sequence (24h, 48h, 1 week)', owner: 'Marketing', dueDate: 'Jun 1', status: 'in_progress', priority: 'high', program: 'All' },
      { id: '7', title: 'Train tour guides on StorySparks curriculum highlights', owner: 'Academic', dueDate: 'May 31', status: 'todo', priority: 'medium', program: 'StorySparks' },
      { id: '8', title: 'Prepare interview assessment rubric for Primary Daycare', owner: 'Admin', dueDate: 'Jun 5', status: 'blocked', priority: 'high', program: 'Primary Daycare' },
    ],
  },
  {
    id: 'offer', name: 'Offer Stage', color: '#ec4899',
    tasks: [
      { id: '9', title: 'Review and update offer letter templates for all programs', owner: 'Admin', dueDate: 'May 28', status: 'done', priority: 'high', program: 'All' },
      { id: '10', title: 'Set 48-hour offer acceptance reminder notifications', owner: 'Admin', dueDate: 'Jun 1', status: 'in_progress', priority: 'medium', program: 'All' },
      { id: '11', title: 'Create Weekend Playschool early-bird discount offer', owner: 'Sales', dueDate: 'Jun 10', status: 'todo', priority: 'low', program: 'Weekend Playschool' },
    ],
  },
  {
    id: 'enrollment', name: 'Enrollment & Onboarding', color: '#10b981',
    tasks: [
      { id: '12', title: 'Update digital enrollment forms for 2026 intake', owner: 'Admin', dueDate: 'May 30', status: 'done', priority: 'high', program: 'All' },
      { id: '13', title: 'Prepare welcome kits for new Preschool families', owner: 'Admin', dueDate: 'Jun 20', status: 'todo', priority: 'medium', program: 'Preschool' },
      { id: '14', title: 'Schedule orientation day for July intake cohort', owner: 'Academic', dueDate: 'Jun 15', status: 'in_progress', priority: 'high', program: 'All' },
      { id: '15', title: 'Send enrollment confirmation emails with first-day info', owner: 'Admin', dueDate: 'Jun 25', status: 'todo', priority: 'medium', program: 'All' },
    ],
  },
];

const TaskCard: React.FC<{ task: WorkflowTask; onStatusChange: (status: Status) => void }> = ({ task, onStatusChange }) => {
  const s = STATUS_CONFIG[task.status];
  return (
    <div className="bg-white border border-gray-100 rounded-lg p-3 shadow-xs hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-medium text-gray-800 leading-snug">{task.title}</p>
        <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full mt-1.5 ${task.priority === 'high' ? 'bg-red-400' : task.priority === 'medium' ? 'bg-amber-400' : 'bg-gray-300'}`} />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`flex items-center gap-1 text-xs font-medium px-1.5 py-0.5 rounded-full ${s.bg} ${s.text}`}>
            {s.icon}{s.label}
          </span>
          {task.program && <span className="text-xs text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded-full">{task.program}</span>}
        </div>
        <span className="text-xs text-gray-400">{task.dueDate}</span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-400">👤 {task.owner}</span>
        <select
          className="text-xs text-gray-500 bg-gray-50 border-0 rounded px-1 py-0.5 cursor-pointer"
          value={task.status}
          onChange={e => onStatusChange(e.target.value as Status)}
        >
          {Object.entries(STATUS_CONFIG).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

const WorkflowView: React.FC = () => {
  const [workflow, setWorkflow] = useState<WorkflowStage[]>(DEFAULT_WORKFLOW);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [view, setView] = useState<'kanban' | 'list'>('kanban');

  const updateTaskStatus = (stageId: string, taskId: string, status: Status) => {
    setWorkflow(prev => prev.map(stage =>
      stage.id === stageId ? {
        ...stage,
        tasks: stage.tasks.map(t => t.id === taskId ? { ...t, status } : t),
      } : stage
    ));
  };

  const totalTasks = workflow.reduce((s, st) => s + st.tasks.length, 0);
  const doneTasks = workflow.reduce((s, st) => s + st.tasks.filter(t => t.status === 'done').length, 0);
  const blockedTasks = workflow.reduce((s, st) => s + st.tasks.filter(t => t.status === 'blocked').length, 0);

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-gray-800">{doneTasks}/{totalTasks}</div>
          <div className="text-xs text-gray-400 mt-1">Tasks Complete</div>
          <div className="h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-green-400 rounded-full" style={{ width: `${(doneTasks/totalTasks)*100}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">{workflow.reduce((s, st) => s + st.tasks.filter(t => t.status === 'in_progress').length, 0)}</div>
          <div className="text-xs text-gray-400 mt-1">In Progress</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <div className={`text-2xl font-bold ${blockedTasks > 0 ? 'text-red-500' : 'text-gray-400'}`}>{blockedTasks}</div>
          <div className="text-xs text-gray-400 mt-1">Blocked</div>
        </div>
      </div>

      {/* View toggle */}
      <div className="flex items-center gap-2">
        <button onClick={() => setView('kanban')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'kanban' ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
          Kanban
        </button>
        <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${view === 'list' ? 'bg-amber-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
          List
        </button>
      </div>

      {view === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflow.map(stage => (
            <div key={stage.id} className="space-y-3">
              <div className="flex items-center gap-2 px-1">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color }} />
                <h3 className="font-semibold text-gray-700 text-sm">{stage.name}</h3>
                <span className="text-xs text-gray-400 bg-gray-100 rounded-full px-2">{stage.tasks.length}</span>
              </div>
              {stage.tasks.map(task => (
                <TaskCard key={task.id} task={task} onStatusChange={s => updateTaskStatus(stage.id, task.id, s)} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {workflow.map(stage => (
            <div key={stage.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setCollapsed(prev => ({ ...prev, [stage.id]: !prev[stage.id] }))}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} />
                <span className="font-semibold text-gray-700 text-sm flex-1 text-left">{stage.name}</span>
                <span className="text-xs text-gray-400">{stage.tasks.filter(t => t.status === 'done').length}/{stage.tasks.length} done</span>
                {collapsed[stage.id] ? <ChevronRight size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </button>
              {!collapsed[stage.id] && (
                <table className="w-full text-sm border-t border-gray-50">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2 font-semibold text-gray-500 text-xs">Task</th>
                      <th className="text-center px-4 py-2 font-semibold text-gray-500 text-xs">Owner</th>
                      <th className="text-center px-4 py-2 font-semibold text-gray-500 text-xs">Program</th>
                      <th className="text-center px-4 py-2 font-semibold text-gray-500 text-xs">Due</th>
                      <th className="text-center px-4 py-2 font-semibold text-gray-500 text-xs">Priority</th>
                      <th className="text-center px-4 py-2 font-semibold text-gray-500 text-xs">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stage.tasks.map(task => {
                      const s = STATUS_CONFIG[task.status];
                      return (
                        <tr key={task.id} className="border-t border-gray-50 hover:bg-gray-50">
                          <td className="px-4 py-2.5 text-gray-700">{task.title}</td>
                          <td className="text-center px-4 py-2.5 text-gray-500">{task.owner}</td>
                          <td className="text-center px-4 py-2.5 text-gray-400 text-xs">{task.program || '—'}</td>
                          <td className="text-center px-4 py-2.5 text-gray-400 text-xs">{task.dueDate}</td>
                          <td className="text-center px-4 py-2.5">
                            <span className={`text-xs font-semibold ${PRIORITY_COLORS[task.priority]}`}>{task.priority.toUpperCase()}</span>
                          </td>
                          <td className="text-center px-4 py-2.5">
                            <select
                              className={`text-xs font-medium px-2 py-0.5 rounded-full border-0 cursor-pointer ${s.bg} ${s.text}`}
                              value={task.status}
                              onChange={e => updateTaskStatus(stage.id, task.id, e.target.value as Status)}
                            >
                              {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                                <option key={k} value={k}>{v.label}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkflowView;
