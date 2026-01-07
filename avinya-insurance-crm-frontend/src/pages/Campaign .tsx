import React, { useState } from 'react';
import { Mention, MentionsInput } from 'react-mentions';

const Campaign = () => {
  const [template, setTemplate] = useState('');

  /* ================= MERGE TAGS ================= */

  const mergeTags = [
    { id: 'name', display: 'Name' },
    { id: 'email', display: 'Email' },
    { id: 'phone', display: 'Phone Number' }
  ];

  /* ================= HANDLERS ================= */

  const handleTemplateChange = (event, newValue) => {
    setTemplate(newValue);
  };

  const handleSave = () => {
    let finalTemplate = template;

    mergeTags.forEach(tag => {
      const mentionPattern = new RegExp(
        `@\\[${tag.display}\\]\\(${tag.id}\\)`,
        'g'
      );
      finalTemplate = finalTemplate.replace(
        mentionPattern,
        `{{${tag.id}}}`
      );
    });

    console.log('Original Template:', template);
    console.log('Final Template:', finalTemplate);
    alert('Template saved! Check console for output.');
  };

  /* ================= PREVIEW ================= */

  const getPreviewText = () => {
    if (!template) return 'Your message preview will appear here...';

    let preview = template;
    preview = preview.replace(/@\[Name\]\(name\)/g, 'John Doe');
    preview = preview.replace(
      /@\[Email\]\(email\)/g,
      'john.doe@example.com'
    );
    preview = preview.replace(
      /@\[Phone Number\]\(phone\)/g,
      '+1 (555) 123-4567'
    );

    return preview;
  };

  /* ================= STYLES ================= */

  // const mentionStyle = {
  //   backgroundColor: '#dbeafe',
  //   color: '#1e40af',
  //   padding: '2px 6px',
  //   borderRadius: '4px',
  //   fontWeight: '500',
  //   fontSize: '14px',
  // };

  const mentionsInputStyle = {
    control: {
      fontSize: 14,
      fontFamily: 'system-ui, -apple-system, sans-serif',
      position: 'relative',
    },

    '&multiLine': {
      control: {
        fontFamily: 'system-ui, -apple-system, sans-serif',
        minHeight: 200,
      },

      /* 🔑 HIGHLY IMPORTANT — MUST MATCH INPUT */
      highlighter: {
        padding: 12,
        fontSize: 14,
        lineHeight: '1.6',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontWeight: 'normal',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
      },

      input: {
        padding: 12,
        border: '1px solid #e2e8f0',
        borderRadius: '0.5rem',
        minHeight: 200,
        fontSize: 14,
        lineHeight: '1.6',
        outline: 'none',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        fontWeight: 'normal',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
      },
    },

    suggestions: {
      list: {
        backgroundColor: 'white',
        border: '1px solid #e2e8f0',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        fontSize: 14,
        maxHeight: 200,
        overflow: 'auto',
      },
      item: {
        padding: '10px 14px',
        borderBottom: '1px solid #f1f5f9',
        cursor: 'pointer',
        '&focused': {
          backgroundColor: '#f8fafc',
        },
      },
    },
  };

  /* ================= RENDER ================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Campaign Template Editor
          </h1>
          <p className="text-slate-600">
            Create personalized message templates with dynamic merge tags
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* ================= TAG SIDEBAR ================= */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 sticky top-6">
              <h3 className="font-semibold text-base text-slate-800 mb-2">
                Available Tags
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Type{' '}
                <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-blue-600">
                  @
                </span>{' '}
                to insert tags
              </p>

              <div className="space-y-2">
                {mergeTags.map(tag => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100"
                  >
                    <span className="text-blue-600 font-mono text-lg font-bold">
                      @
                    </span>
                    <span className="text-slate-700 font-medium text-sm">
                      {tag.display}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="text-xs text-amber-800 leading-relaxed">
                  <span className="font-semibold">Tip:</span> Tags will be
                  replaced with actual customer data when sending campaigns.
                </p>
              </div>
            </div>
          </div>

          {/* ================= EDITOR ================= */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <label className="text-base font-semibold text-slate-800">
                  Campaign Message Template
                </label>
                <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                  {template.length} characters
                </span>
              </div>

              <MentionsInput
                value={template}
                onChange={handleTemplateChange}
                placeholder="Start typing your message... Type @ to insert tags"
                markup="@[__display__](__id__)"
                style={mentionsInputStyle}
                allowSuggestionsAboveCursor
              >
                <Mention
                  trigger="@"
                  data={mergeTags}
                  markup="@[__display__](__id__)"
                  // style={mentionStyle}
                  displayTransform={(id, display) => `@${display}`}
                  renderSuggestion={(suggestion, search, highlightedDisplay) => (
                    <div className="flex items-center gap-2">
                      <span className="text-blue-600 font-mono">@</span>
                      <span>{highlightedDisplay}</span>
                    </div>
                  )}
                />
              </MentionsInput>

              <div className="mt-6 flex items-center justify-between">
                <span className="text-sm text-slate-600">
                  Tags appear in blue
                </span>
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700"
                >
                  Save Template
                </button>
              </div>
            </div>

            {/* ================= PREVIEW ================= */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-semibold text-slate-800 mb-4">
                Preview with Sample Data
              </h3>

              <div className="bg-slate-50 rounded-lg p-5 border border-slate-200 min-h-[120px]">
                <p className="text-sm text-slate-700 whitespace-pre-wrap">
                  {getPreviewText()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaign;
