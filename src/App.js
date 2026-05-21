import React, { useState } from 'react'; 
// Import the schedule data from the JSON file
import scheduleData from './schedule_data.json';
import './App.css'; 

function App() {
  // Always start from this tab
  const [currentTab, setCurrentTab] = useState('schedule');
  
  // Extract all the days from the JSON object keys (ie. Monday August 26th, Tuesday August 27th...)
  const days = Object.keys(scheduleData);
  
  // Track which specific schedule day is currently selected
  const [activeDay, setActiveDay] = useState(days[0]);

  // Converts 24h (13:30) format into 12h format (1:30 PM)
  const formatTime = (timeString) => {
    // If no specific hour provided, then return "All Day"
    if (!timeString || timeString.trim() === "") return "All Day";
    
    // Remove the a1/p1 from string
    let cleanStr = timeString.replace(/a1\/p1/g, '').trim(); 
    
    // If string already contains AM or PM, just return it.
    if (cleanStr.toUpperCase().includes('AM') || cleanStr.toUpperCase().includes('PM')) {
      return cleanStr;
    }
    
    // If there is nothing (because we stripped a1/p1), convert to 12h format
    if (cleanStr.includes(':')) {
      const parts = cleanStr.split(':');
      let hours = parseInt(parts[0], 10);
      const minutes = parts[1]; // Grabs minutes and add to array
      
      // For hours, need to modulus it with 12 to find 12h format number
      if (!isNaN(hours)) {
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // Converts 0 hours to 12
        return `${hours}:${minutes} ${ampm}`; // splices both minutes and hours
      }
    }
    return cleanStr;
  };

  // Matches icons directly to event context strings
  const getEventIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('check in') || lowerName.includes('meet')) return '👋';
    if (lowerName.includes('matriculation')) return '🎓';
    if (lowerName.includes('d!ye')) return '🪣';
    if (lowerName.includes('games')) return '🏆';
    if (lowerName.includes('lunch') || lowerName.includes('dinner')) return '🍽️';
    if (lowerName.includes('walkaround')) return '🏙️';
    if (lowerName.includes('unwind') || lowerName.includes('night')) return '🛋️';
    if (lowerName.includes('***')) return '🕵️‍♂️';
    if (lowerName.includes('tour')) return '🗺️';  
    if (lowerName.includes('consent')) return '🤝'; 
    if (lowerName.includes('battle')) return '⚔️';   
    if (lowerName.includes('seminar')) return '📚';   
    if (lowerName.includes('cheer')) return '📣';  
    if (lowerName.includes('trivia')) return '🧠';    
    if (lowerName.includes('hunt')) return '🗺️';
    if (lowerName.includes('fair')) return '🎪';
    if (lowerName.includes('olympiks')) return '👟';
    if (lowerName.includes('talent')) return '🎤';
    return '⚙️'; // Helper to check if missed any icons
  };

  // Helper function to convert long titles like "MONDAY AUGUST 26" into shorter tabs like "Mon 26"
  const getShortDayLabel = (dayString) => {
    const parts = dayString.split(' ');
    // split spring to get only the three characters
    if (parts.length >= 3) {
      const shortDay = parts[0].substring(0, 3).toUpperCase();
      const dateNum = parts[2]; 
      return { shortDay, dateNum };
    }
    return { shortDay: dayString, dateNum: '' };
  };

  return (
    <div className="app-container">
      {/* THE F!ROSH PURPLE BANNER */}
      <header className="frosh-banner">
        <div className="banner-left" onClick={() => { setCurrentTab('schedule'); setActiveDay(days[0]); }}>
          <img 
            src="/assets/main-logo.png" 
            alt="F!rosh Logo" 
            className="frosh-logo" 
          />
          <h1 className="banner-title">F!ROSH 3T0</h1>
        </div>

        {/* THE NAVIGATION LABELS */}
        <nav className="banner-nav">
          <button 
            className={`nav-link ${currentTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setCurrentTab('schedule')}
          >
            Schedule
          </button>
          <button 
            className={`nav-link ${currentTab === 'about' ? 'active' : ''}`}
            onClick={() => setCurrentTab('about')}
          >
            About Us
          </button>
          <button 
            className={`nav-link ${currentTab === 'contact' ? 'active' : ''}`}
            onClick={() => setCurrentTab('contact')}
          >
            Contact Us
          </button>
          <a 
            href="https://undergrad.engineering.utoronto.ca/" 
            target="_blank" 
            rel="noreferrer" 
            className="nav-link external"
          >
            More Info on Frosh ↗
          </a>
        </nav>
      </header>

      {/* DYNAMIC CONTENT AREA */}
      <main className="main-content">
        
        {/* SCHEDULE PAGE VIEW */}
        {currentTab === 'schedule' && (
          <div className="schedule-container">
            
            {/* DATE SELECTOR BAR */}
            <div className="date-selector-bar">
              {days.map((day) => {
                const { shortDay, dateNum } = getShortDayLabel(day);
                return (
                  <button
                    key={day}
                    className={`date-tab-button ${activeDay === day ? 'selected' : ''}`}
                    onClick={() => setActiveDay(day)}
                  >
                    <span className="tab-day-name">{shortDay}</span>
                    <span className="tab-date-number">{dateNum}</span>
                  </button>
                );
              })}
            </div>

            {/* THE SCHEDULE GRID FOR THE ACTIVE DAY ONLY */}
            <div className="active-day-view">
              <h2 className="current-day-title">{activeDay}</h2>
              
              <div className="events-grid">
                {scheduleData[activeDay].map((event, index) => {
                  
                  // Checks if we there is **** event, and need to provide the extra styling (dotted dashes) 
                  const rawName = event["Event Name"];
                  const isMystery = rawName === "****";
                  const eventColor = event.Color || 'gray'; // default colour if no colour specified

                  return (
                    <div 
                      key={index} 
                      className={`event-card border-${eventColor} ${isMystery ? 'mystery-card' : ''}`}
                    >
                      {/* Dynamic Time Header Tag */}
                      <div className={`event-tag bg-${eventColor}`}>
                        <span>
                          {formatTime(event["Start Time"])} 
                          {event["End Time"] && event["Start Time"].trim() !== "" && ` - ${formatTime(event["End Time"])}`}
                        </span>
                      </div>

                      {/* Card Body Components grouped via Side-By-Side Layouts */}
                      <div className="event-body">
                        <div className="event-main-info">
                          
                          {/* Rounded Icons */}
                          <span className="event-icon-badge">{getEventIcon(rawName)}</span>
                          
                          <div className="event-text-block">
                            <h4>{rawName}</h4>
                            
                            {event["Event Location"] && (
                              <p className="event-location">
                                <span className="pin-icon">📍</span> {event["Event Location"]}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        {event["Event Description"] && (
                          <p 
                            className="event-description"
                            dangerouslySetInnerHTML={{ __html: event["Event Description"] }}
                          />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* ABOUT US VIEW */}
        {currentTab === 'about' && (
          <div className="page-view">
            <h2>About Us 💜</h2>
            <p>Welcome to UofT Engineering! The Tech Team challenge is designed to help 3T0s integrate smoothly into SKULE™ life. We build tools, create connections, and celebrate the best engineering traditions in Canada.</p>
          </div>
        )}

        {/* CONTACT US VIEW */}
        {currentTab === 'contact' && (
          <div className="page-view">
            <h2>Contact Us 📬</h2>
            <p>Have questions about F!rosh Week? Reach out to your subcomms or email us directly at <strong>orientation@ecf.utoronto.ca</strong>. We are always here to help!</p>
          </div>
        )}
      </main>

      {/* BOTTOM LABEL OR FOOTER */}
      <footer className="frosh-footer">
        <div className="footer-content">
          <div className="footer-left">
            <span className="footer-brand">F!ROSH Week 3T0</span>
            <span className="footer-divider">|</span>
            <span className="footer-subtext">Engineering SKULE™</span>
          </div>
          
          <div className="footer-right">
            <button className="footer-link" onClick={() => setCurrentTab('schedule')}>Schedule</button>
            <button className="footer-link" onClick={() => setCurrentTab('about')}>About Us</button>
            <button className="footer-link" onClick={() => setCurrentTab('contact')}>Contact Us</button>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} University of Toronto Engineering Society. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
