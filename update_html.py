with open('index.html', 'r') as f:
    lines = f.readlines()

replacement = '''          <div class="robotics-header" style="margin-bottom: 40px; margin-top: -20px;">
            <div class="robotics-label" style="text-transform: none;">
              <span class="robotics-dot"></span> Expert orthopaedic insights and treatments by Dr. Vijaykumar D
            </div>
            <h2 class="robotics-title">OUR EDUCATIONAL VIDEOS</h2>
          </div>

          <div class="youtube-cards-wrapper">
            <!-- English Card -->
            <div class="yt-vt-card">
              <!-- Back Face -->
              <div class="yt-vt-back">
                <div class="yt-vt-back-content">
                  <div class="yt-badge yt-badge-blue">English</div>
                  <h3 class="yt-back-title">Physiotherapy for Knee Osteoarthritis</h3>
                  <p class="yt-back-desc">Targeted strengthening exercises to reduce pain and improve mobility &mdash; by Dr. Vijaykumar D, AIIMS Delhi.</p>
                  <a href="https://www.youtube.com/watch?v=vminONFLauo" class="yt-watch-btn">
                    <ion-icon name="play" style="font-size: 20px;"></ion-icon> Watch on YouTube
                  </a>
                </div>
              </div>

              <!-- Front Face (4 Strips) -->
              <div class="yt-vt-front">
                <div class="vt-strip vt-strip-1">
                  <div class="vt-front-content">
                    <div class="yt-front-inner">
                      <div class="yt-pulse-btn">
                        <div class="yt-pulse-ring"></div>
                        <div class="yt-play-circle"><ion-icon name="play" style="margin-left: 3px; font-size: 28px;"></ion-icon></div>
                      </div>
                      <div class="yt-front-bottom">
                        <div class="yt-badge yt-badge-white">English</div>
                        <h3 class="yt-front-title">Knee Strengthening Exercises &mdash; Osteoarthritis</h3>
                        <p class="yt-hover-prompt">Hover to see details &rsaquo;</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="vt-strip vt-strip-2">
                  <div class="vt-front-content">
                    <div class="yt-front-inner">
                      <div class="yt-pulse-btn">
                        <div class="yt-pulse-ring"></div>
                        <div class="yt-play-circle"><ion-icon name="play" style="margin-left: 3px; font-size: 28px;"></ion-icon></div>
                      </div>
                      <div class="yt-front-bottom">
                        <div class="yt-badge yt-badge-white">English</div>
                        <h3 class="yt-front-title">Knee Strengthening Exercises &mdash; Osteoarthritis</h3>
                        <p class="yt-hover-prompt">Hover to see details &rsaquo;</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="vt-strip vt-strip-3">
                  <div class="vt-front-content">
                    <div class="yt-front-inner">
                      <div class="yt-pulse-btn">
                        <div class="yt-pulse-ring"></div>
                        <div class="yt-play-circle"><ion-icon name="play" style="margin-left: 3px; font-size: 28px;"></ion-icon></div>
                      </div>
                      <div class="yt-front-bottom">
                        <div class="yt-badge yt-badge-white">English</div>
                        <h3 class="yt-front-title">Knee Strengthening Exercises &mdash; Osteoarthritis</h3>
                        <p class="yt-hover-prompt">Hover to see details &rsaquo;</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="vt-strip vt-strip-4">
                  <div class="vt-front-content">
                    <div class="yt-front-inner">
                      <div class="yt-pulse-btn">
                        <div class="yt-pulse-ring"></div>
                        <div class="yt-play-circle"><ion-icon name="play" style="margin-left: 3px; font-size: 28px;"></ion-icon></div>
                      </div>
                      <div class="yt-front-bottom">
                        <div class="yt-badge yt-badge-white">English</div>
                        <h3 class="yt-front-title">Knee Strengthening Exercises &mdash; Osteoarthritis</h3>
                        <p class="yt-hover-prompt">Hover to see details &rsaquo;</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Hindi Card -->
            <div class="yt-vt-card">
              <!-- Back Face -->
              <div class="yt-vt-back">
                <div class="yt-vt-back-content">
                  <div class="yt-badge yt-badge-blue">हिंदी</div>
                  <h3 class="yt-back-title">घुटने की मजबूती के व्यायाम &mdash; ऑस्टियोआर्थराइटिस</h3>
                  <p class="yt-back-desc">Targeted strengthening exercises to reduce pain and improve mobility &mdash; by Dr. Vijaykumar D, AIIMS Delhi.</p>
                  <a href="https://www.youtube.com/watch?v=vminONFLauo" class="yt-watch-btn">
                    <ion-icon name="play" style="font-size: 20px;"></ion-icon> Watch on YouTube
                  </a>
                </div>
              </div>

              <!-- Front Face (4 Strips) -->
              <div class="yt-vt-front">
                <div class="vt-strip vt-strip-1">
                  <div class="vt-front-content">
                    <div class="yt-front-inner">
                      <div class="yt-pulse-btn">
                        <div class="yt-pulse-ring"></div>
                        <div class="yt-play-circle"><ion-icon name="play" style="margin-left: 3px; font-size: 28px;"></ion-icon></div>
                      </div>
                      <div class="yt-front-bottom">
                        <div class="yt-badge yt-badge-white">हिंदी</div>
                        <h3 class="yt-front-title">घुटने की मजबूती के व्यायाम &mdash; ऑस्टियोआर्थराइटिस</h3>
                        <p class="yt-hover-prompt">Hover to see details &rsaquo;</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="vt-strip vt-strip-2">
                  <div class="vt-front-content">
                    <div class="yt-front-inner">
                      <div class="yt-pulse-btn">
                        <div class="yt-pulse-ring"></div>
                        <div class="yt-play-circle"><ion-icon name="play" style="margin-left: 3px; font-size: 28px;"></ion-icon></div>
                      </div>
                      <div class="yt-front-bottom">
                        <div class="yt-badge yt-badge-white">हिंदी</div>
                        <h3 class="yt-front-title">घुटने की मजबूती के व्यायाम &mdash; ऑस्टियोआर्थराइटिस</h3>
                        <p class="yt-hover-prompt">Hover to see details &rsaquo;</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="vt-strip vt-strip-3">
                  <div class="vt-front-content">
                    <div class="yt-front-inner">
                      <div class="yt-pulse-btn">
                        <div class="yt-pulse-ring"></div>
                        <div class="yt-play-circle"><ion-icon name="play" style="margin-left: 3px; font-size: 28px;"></ion-icon></div>
                      </div>
                      <div class="yt-front-bottom">
                        <div class="yt-badge yt-badge-white">हिंदी</div>
                        <h3 class="yt-front-title">घुटने की मजबूती के व्यायाम &mdash; ऑस्टियोआर्थराइटिस</h3>
                        <p class="yt-hover-prompt">Hover to see details &rsaquo;</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="vt-strip vt-strip-4">
                  <div class="vt-front-content">
                    <div class="yt-front-inner">
                      <div class="yt-pulse-btn">
                        <div class="yt-pulse-ring"></div>
                        <div class="yt-play-circle"><ion-icon name="play" style="margin-left: 3px; font-size: 28px;"></ion-icon></div>
                      </div>
                      <div class="yt-front-bottom">
                        <div class="yt-badge yt-badge-white">हिंदी</div>
                        <h3 class="yt-front-title">घुटने की मजबूती के व्यायाम &mdash; ऑस्टियोआर्थराइटिस</h3>
                        <p class="yt-hover-prompt">Hover to see details &rsaquo;</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>\n'''

new_lines = lines[:911] + [replacement] + lines[1009:]
with open('index.html', 'w') as f:
    f.writelines(new_lines)
