import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';

const NewConnectionForm = () => {
  const [selectedProtocol, setSelectedProtocol] = useState('');
  const [connectionName, setConnectionName] = useState('');
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('basic');
  const baseURL = import.meta.env.VITE_BASE_URL;
  const dataSource = "mysql";
  const token = localStorage.getItem("authToken");
  const protocols = ['vnc', 'ssh', 'rdp', 'kubernetes', 'telnet'];
  const protocolParameters = { /* ... (unchanged list of parameters) */ };

  const enhancedProtocolData = {
    vnc: {
      connectionForms: [
        { 
          name: 'Basic Settings',
          tab: 'basic',
          fields: [
            { name: 'hostname', type: 'TEXT', label: 'Hostname', required: true },
            { name: 'port', type: 'NUMERIC', label: 'Port' },
            { name: 'username', type: 'TEXT', label: 'Username' },
            { name: 'password', type: 'PASSWORD', label: 'Password' }
          ] 
        },
        { 
          name: 'Display Settings',
          tab: 'display',
          fields: [
            { name: 'color-depth', type: 'SELECT', label: 'Color Depth', 
              options: [
                { value: '8', label: '8-bit' },
                { value: '16', label: '16-bit' },
                { value: '24', label: '24-bit' },
                { value: '32', label: '32-bit' }
              ]
            },
            { name: 'swap-red-blue', type: 'CHECKBOX', label: 'Swap Red/Blue Components' },
            { name: 'cursor', type: 'SELECT', label: 'Cursor', 
              options: [
                { value: 'local', label: 'Local' },
                { value: 'remote', label: 'Remote' }
              ]
            },
            { name: 'read-only', type: 'CHECKBOX', label: 'Read-only Mode' }
          ] 
        },
        { 
          name: 'Clipboard Settings', 
          tab: 'clipboard',
          fields: [
            { name: 'clipboard-encoding', type: 'SELECT', label: 'Clipboard Encoding', 
              options: [
                { value: 'ISO8859-1', label: 'ISO 8859-1' },
                { value: 'UTF-8', label: 'UTF-8' },
                { value: 'UTF-16', label: 'UTF-16' }
              ]
            },
            { name: 'disable-copy', type: 'CHECKBOX', label: 'Disable Copy from Server' },
            { name: 'disable-paste', type: 'CHECKBOX', label: 'Disable Paste to Server' }
          ] 
        },
        {
          name: 'SFTP Settings',
          tab: 'SFTP',
          fields: [
            { name: 'enable-sftp', type: 'CHECKBOX', label: 'Enable SFTP' },
            { name: 'sftp-hostname', type: 'TEXT', label: 'SFTP Hostname' },
            { name: 'sftp-port', type: 'NUMERIC', label: 'SFTP Port' },
            { name: 'sftp-username', type: 'TEXT', label: 'SFTP Username' },
            { name: 'sftp-password', type: 'PASSWORD', label: 'SFTP Password' },
            { name: 'sftp-private-key', type: 'TEXTAREA', label: 'SFTP Private Key' },
            { name: 'sftp-passphrase', type: 'PASSWORD', label: 'SFTP Passphrase' },
            { name: 'sftp-root-directory', type: 'TEXT', label: 'SFTP Root Directory' }
          ]
        }
      ]
    },
    ssh: {
      connectionForms: [
        {
          name: 'Basic Settings',
          tab: 'basic',
          fields: [
            { name: 'hostname', type: 'TEXT', label: 'Hostname', required: true },
            { name: 'port', type: 'NUMERIC', label: 'Port' },
            { name: 'username', type: 'TEXT', label: 'Username', required: true },
            { name: 'password', type: 'PASSWORD', label: 'Password' },
            { name: 'private-key', type: 'TEXTAREA', label: 'Private Key' },
            { name: 'passphrase', type: 'PASSWORD', label: 'Passphrase' }
          ]
        },
        {
          name: 'Terminal Settings',
          tab: 'terminal',
          fields: [
            { name: 'color-scheme', type: 'SELECT', label: 'Color Scheme',
              options: [
                { value: 'black-white', label: 'Black on white' },
                { value: 'gray-black', label: 'Gray on black' },
                { value: 'green-black', label: 'Green on black' },
                { value: 'white-black', label: 'White on black' }
              ]
            },
            { name: 'font-name', type: 'TEXT', label: 'Font Name' },
            { name: 'font-size', type: 'NUMERIC', label: 'Font Size' },
            { name: 'scrollback', type: 'NUMERIC', label: 'Scrollback Lines' },
            { name: 'terminal-type', type: 'TEXT', label: 'Terminal Type' },
            { name: 'command', type: 'TEXT', label: 'Command (optional)' }
          ]
        },
        {
          name: 'Network Settings',
          tab: 'network',
          fields: [
            { name: 'server-alive-interval', type: 'NUMERIC', label: 'Server Keepalive Interval (seconds)' },
            { name: 'read-only', type: 'CHECKBOX', label: 'Read-only Mode' }
          ]
        },
        {
          name: 'SFTP Settings',
          tab: 'SFTP',
          fields: [
            { name: 'enable-sftp', type: 'CHECKBOX', label: 'Enable SFTP' },
            { name: 'sftp-root-directory', type: 'TEXT', label: 'SFTP Root Directory' }
          ]
        },
        {
          name: 'Recording Settings',
          tab: 'recording',
          fields: [
            { name: 'enable-recording', type: 'CHECKBOX', label: 'Enable Recording' },
            { name: 'create-recording-path', type: 'CHECKBOX', label: 'Create Recording Path' },
            { name: 'recording-name', type: 'TEXT', label: 'Recording Name' },
            { name: 'recording-path', type: 'TEXT', label: 'Recording Path' }
          ]
        }
      ]
    },
    rdp: {
      connectionForms: [
        {
          name: 'Basic Settings',
          tab: 'basic',
          fields: [
            { name: 'hostname', type: 'TEXT', label: 'Hostname', required: true },
            { name: 'port', type: 'NUMERIC', label: 'Port' },
            { name: 'username', type: 'TEXT', label: 'Username' },
            { name: 'password', type: 'PASSWORD', label: 'Password' },
            { name: 'domain', type: 'TEXT', label: 'Domain' },
            { name: 'security', type: 'SELECT', label: 'Security Mode',
              options: [
                { value: 'any', label: 'Any' },
                { value: 'nla', label: 'NLA (Network Level Authentication)' },
                { value: 'tls', label: 'TLS' },
                { value: 'rdp', label: 'RDP' }
              ]
            },
            { name: 'ignore-cert', type: 'CHECKBOX', label: 'Ignore Certificate' }
          ]
        },
        {
          name: 'Display Settings',
          tab: 'display',
          fields: [
            { name: 'width', type: 'NUMERIC', label: 'Width' },
            { name: 'height', type: 'NUMERIC', label: 'Height' },
            { name: 'dpi', type: 'NUMERIC', label: 'DPI' },
            { name: 'color-depth', type: 'SELECT', label: 'Color Depth',
              options: [
                { value: '8', label: '8-bit' },
                { value: '16', label: '16-bit' },
                { value: '24', label: '24-bit' },
                { value: '32', label: '32-bit' }
              ]
            },
            { name: 'resize-method', type: 'SELECT', label: 'Resize Method',
              options: [
                { value: 'display-update', label: 'RDP Display Update' },
                { value: 'reconnect', label: 'Reconnect' }
              ]
            }
          ]
        },
        {
          name: 'Performance Settings',
          tab: 'performance',
          fields: [
            { name: 'enable-wallpaper', type: 'CHECKBOX', label: 'Enable Wallpaper' },
            { name: 'enable-theming', type: 'CHECKBOX', label: 'Enable Theming' },
            { name: 'enable-font-smoothing', type: 'CHECKBOX', label: 'Enable Font Smoothing' },
            { name: 'enable-full-window-drag', type: 'CHECKBOX', label: 'Enable Full Window Drag' },
            { name: 'enable-desktop-composition', type: 'CHECKBOX', label: 'Enable Desktop Composition' },
            { name: 'enable-menu-animations', type: 'CHECKBOX', label: 'Enable Menu Animations' },
            { name: 'disable-bitmap-caching', type: 'CHECKBOX', label: 'Disable Bitmap Caching' },
            { name: 'disable-offscreen-caching', type: 'CHECKBOX', label: 'Disable Offscreen Caching' }
          ]
        },
        {
          name: 'Device Redirection',
          tab: 'devices',
          fields: [
            { name: 'enable-audio', type: 'CHECKBOX', label: 'Enable Audio' },
            { name: 'enable-audio-input', type: 'CHECKBOX', label: 'Enable Microphone' },
            { name: 'enable-printing', type: 'CHECKBOX', label: 'Enable Printing' },
            { name: 'printer-name', type: 'TEXT', label: 'Printer Name' },
            { name: 'enable-drive', type: 'CHECKBOX', label: 'Enable Drive' },
            { name: 'drive-name', type: 'TEXT', label: 'Drive Name' },
            { name: 'drive-path', type: 'TEXT', label: 'Drive Path' },
            { name: 'create-drive-path', type: 'CHECKBOX', label: 'Create Drive Path If Missing' }
          ]
        },
        {
          name: 'Gateway Settings',
          tab: 'gateway',
          fields: [
            { name: 'gateway-hostname', type: 'TEXT', label: 'Gateway Hostname' },
            { name: 'gateway-port', type: 'NUMERIC', label: 'Gateway Port' },
            { name: 'gateway-username', type: 'TEXT', label: 'Gateway Username' },
            { name: 'gateway-password', type: 'PASSWORD', label: 'Gateway Password' },
            { name: 'gateway-domain', type: 'TEXT', label: 'Gateway Domain' }
          ]
        },
        {
          name: 'Advanced Settings',
          tab: 'advanced',
          fields: [
            { name: 'console', type: 'CHECKBOX', label: 'Admin Console' },
            { name: 'initial-program', type: 'TEXT', label: 'Initial Program' },
            { name: 'client-name', type: 'TEXT', label: 'Client Name' },
            { name: 'read-only', type: 'CHECKBOX', label: 'Read-only Mode' }
          ]
        }
      ]
    },
    kubernetes: {
      connectionForms: [
        {
          name: 'Basic Settings',
          tab: 'basic',
          fields: [
            { name: 'hostname', type: 'TEXT', label: 'Kubernetes API URL', required: true },
            { name: 'ca-cert', type: 'TEXTAREA', label: 'CA Certificate' },
            { name: 'client-cert', type: 'TEXTAREA', label: 'Client Certificate' },
            { name: 'client-key', type: 'TEXTAREA', label: 'Client Key' },
            { name: 'namespace', type: 'TEXT', label: 'Namespace', required: true },
            { name: 'pod', type: 'TEXT', label: 'Pod Name', required: true },
            { name: 'container', type: 'TEXT', label: 'Container Name' },
            { name: 'use-ssl', type: 'CHECKBOX', label: 'Use SSL' },
            { name: 'ignore-cert', type: 'CHECKBOX', label: 'Ignore Certificate Errors' }
          ]
        },
        {
          name: 'Terminal Settings',
          tab: 'terminal',
          fields: [
            { name: 'color-scheme', type: 'SELECT', label: 'Color Scheme',
              options: [
                { value: 'black-white', label: 'Black on white' },
                { value: 'gray-black', label: 'Gray on black' },
                { value: 'green-black', label: 'Green on black' },
                { value: 'white-black', label: 'White on black' }
              ]
            },
            { name: 'font-name', type: 'TEXT', label: 'Font Name' },
            { name: 'font-size', type: 'NUMERIC', label: 'Font Size' },
            { name: 'scrollback', type: 'NUMERIC', label: 'Scrollback Lines' }
          ]
        }
      ]
    },
    telnet: {
      connectionForms: [
        {
          name: 'Basic Settings',
          tab: 'basic',
          fields: [
            { name: 'hostname', type: 'TEXT', label: 'Hostname', required: true },
            { name: 'port', type: 'NUMERIC', label: 'Port' },
            { name: 'username', type: 'TEXT', label: 'Username' },
            { name: 'password', type: 'PASSWORD', label: 'Password' }
          ]
        },
        {
          name: 'Terminal Settings',
          tab: 'terminal',
          fields: [
            { name: 'color-scheme', type: 'SELECT', label: 'Color Scheme',
              options: [
                { value: 'black-white', label: 'Black on white' },
                { value: 'gray-black', label: 'Gray on black' },
                { value: 'green-black', label: 'Green on black' },
                { value: 'white-black', label: 'White on black' }
              ]
            },
            { name: 'font-name', type: 'TEXT', label: 'Font Name' },
            { name: 'font-size', type: 'NUMERIC', label: 'Font Size' },
            { name: 'scrollback', type: 'NUMERIC', label: 'Scrollback Lines' },
            { name: 'terminal-type', type: 'TEXT', label: 'Terminal Type' }
          ]
        },
        {
          name: 'Authentication Settings',
          tab: 'auth',
          fields: [
            { name: 'username-regex', type: 'TEXT', label: 'Username Regex' },
            { name: 'password-regex', type: 'TEXT', label: 'Password Regex' },
            { name: 'login-success-regex', type: 'TEXT', label: 'Login Success Regex' },
            { name: 'login-failure-regex', type: 'TEXT', label: 'Login Failure Regex' }
          ]
        }
      ]
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    setFormData(prev => ({ ...prev, [name]: fieldValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = enhancedProtocolData[selectedProtocol]
      ?.connectionForms
      .flatMap(form => form.fields)
      .filter(field => field.required)
      .map(field => field.name);
    
    const missingFields = requiredFields?.filter(field => 
      formData[field] === undefined || formData[field] === ''
    );
    
    if (missingFields?.length) {
      toast.error(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Construct parameters
    const parameters = {};
    protocolParameters[selectedProtocol]?.forEach((param) => {
      if (formData[param] !== undefined && formData[param] !== '') {
        parameters[param] = String(formData[param]);
      }
    });

    const requestBody = {
      parentIdentifier: '1',
      name: connectionName,
      protocol: selectedProtocol,
      parameters,
      attributes: {
        "max-connections": null,
        "max-connections-per-user": null,
        "weight": null,
        "failover-only": null,
        "guacd-port": null,
        "guacd-encryption": null,
        "guacd-hostname": null
      }
    };

    try {
      const response = await fetch(`${baseURL}/api/session/data/${dataSource}/connections`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'guacamole-token': token
        },
        body: JSON.stringify(requestBody)
      });
      
      if (response.ok) {
        toast.success('Connection created successfully!');
        setConnectionName('');
        setSelectedProtocol('');
        setFormData({});
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        toast.error(`Failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Network Error:', error);
      toast.error('Connection failed');
    }
  };

  const getAvailableTabs = () => {
    if (!selectedProtocol || !enhancedProtocolData[selectedProtocol]) return ['basic'];
    const tabs = new Set();
    enhancedProtocolData[selectedProtocol].connectionForms.forEach(form => {
      tabs.add(form.tab);
    });
    return Array.from(tabs);
  };

  const renderTabContent = () => {
    if (!selectedProtocol || !enhancedProtocolData[selectedProtocol]) return null;
    return enhancedProtocolData[selectedProtocol].connectionForms
      .filter(form => form.tab === activeTab)
      .map((form, index) => (
        <div key={index} className="mb-4">
          <h6 className="fw-bold mb-3">{form.name}</h6>
          {form.fields.map((field, idx) => renderField(field, idx))}
        </div>
      ));
  };

  const renderField = (field, idx) => {
    const fieldValue = formData[field.name] || '';
    
    switch (field.type) {
      case 'TEXT':
      case 'NUMERIC':
      case 'PASSWORD':
        return (
          <div key={idx} className="mb-3">
            <label htmlFor={field.name} className="form-label">
              {field.label} {field.required && <span className="text-danger">*</span>}
            </label>
            <input
              type={field.type === 'PASSWORD' ? 'password' : field.type === 'NUMERIC' ? 'number' : 'text'}
              className="form-control"
              id={field.name}
              name={field.name}
              value={fieldValue}
              placeholder={`Enter ${field.label}`}
              onChange={handleInputChange}
              required={field.required}
            />
          </div>
        );
      case 'TEXTAREA':
        return (
          <div key={idx} className="mb-3">
            <label htmlFor={field.name} className="form-label">
              {field.label} {field.required && <span className="text-danger">*</span>}
            </label>
            <textarea
              className="form-control"
              id={field.name}
              name={field.name}
              value={fieldValue}
              placeholder={`Enter ${field.label}`}
              onChange={handleInputChange}
              required={field.required}
              rows={5}
            />
          </div>
        );
      case 'SELECT':
        return (
          <div key={idx} className="mb-3">
            <label htmlFor={field.name} className="form-label">
              {field.label} {field.required && <span className="text-danger">*</span>}
            </label>
            <select
              className="form-select"
              id={field.name}
              name={field.name}
              value={fieldValue}
              onChange={handleInputChange}
              required={field.required}
            >
              <option value="">-- Select {field.label} --</option>
              {field.options.map((option, optionIdx) => (
                <option key={optionIdx} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      case 'CHECKBOX':
        return (
          <div key={idx} className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id={field.name}
              name={field.name}
              checked={!!formData[field.name]}
              onChange={handleInputChange}
            />
            <label className="form-check-label" htmlFor={field.name}>
              {field.label}
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  const tabs = getAvailableTabs();
  
  return (
    <>
      <h4 className="py-3 mb-4">
        <span className="text-muted fw-light">Connections /</span> Create New
      </h4>
      <div className="row">
        <div className="col-xl">
          <div className="card mb-4">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Create a New Connection</h5>
              <small className="text-muted float-end">Fill in the details</small>
            </div>
            <div className="card-body">
              {/* Name Field */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="Enter connection name"
                  value={connectionName}
                  onChange={(e) => setConnectionName(e.target.value)}
                  required
                />
              </div>
              {/* Location Field */}
              <div className="mb-3">
                <label htmlFor="location" className="form-label">
                  Location
                </label>
                <select className="form-select" id="location" defaultValue="ROOT">
                  <option value="ROOT">Root</option>
                </select>
              </div>
              {/* Protocol Selection */}
              <div className="mb-3">
                <label htmlFor="protocol" className="form-label">
                  Protocol <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  id="protocol"
                  value={selectedProtocol}
                  onChange={(e) => {
                    setSelectedProtocol(e.target.value);
                    setFormData({});
                    setActiveTab('basic');
                  }}
                  required
                >
                  <option value="">-- Select Protocol --</option>
                  {protocols.map((protocol) => (
                    <option key={protocol} value={protocol}>
                      {protocol.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
              {selectedProtocol && (
                <>
                  {/* Tab Navigation */}
                  <ul className="nav nav-tabs mb-3">
                    {tabs.map((tab) => (
                      <li key={tab} className="nav-item">
                        <button
                          className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                          onClick={() => setActiveTab(tab)}
                        >
                          {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                      </li>
                    ))}
                  </ul>
                  {/* Tab Content */}
                  <div className="tab-content">
                    <div className="tab-pane fade show active">
                      {renderTabContent()}
                    </div>
                  </div>
                </>
              )}
              {/* Submit Button */}
              <div className="mt-4">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleSubmit}
                  disabled={!selectedProtocol || !connectionName}
                >
                  Create Connection
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default NewConnectionForm;