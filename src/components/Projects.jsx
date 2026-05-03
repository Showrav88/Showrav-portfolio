import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

const Projects = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState({});

  const projects = [
    {
      title: 'Jewelry Management System V1',
      description: 'A comprehensive jewelry management system with full CRUD operations, inventory tracking, and sales management. Built with modern web technologies including React, Node.js, PostgreSQL, and complete document management for a professional jewelry business solution.',
      tech: ['React', 'Node.js', 'PostgreSQL', 'Express.js', 'Database Management'],
      github: 'https://github.com/Showrav88/JewelryMSV1',
      images: [
        '/images/documents/jewelry-ms-dashboard.png',
        '/images/documents/jewelry-ms-inventory.png',
        '/images/documents/jewelry-ms-sales.png'
      ],
      color: '#d4af37'
    },
    {
      title: 'E2E Test Automation Framework',
      description: 'Professional End-to-End (E2E) Test Automation Framework built with Playwright and Allure Reports. Automates testing for SauceDemo application using the Page Object Model (POM) pattern with different user behaviors. Features fully integrated CI/CD pipeline via GitHub Actions.',
      tech: ['Playwright', 'Allure Reports', 'POM Pattern', 'GitHub Actions', 'JavaScript'],
      github: 'https://github.com/Showrav88/sawglab_with_playwright_allure',
      images: [
        '/images/documents/e2e-test-framework-dashboard.png',
        '/images/documents/e2e-test-report.png',
        '/images/documents/e2e-test-execution.png'
      ],
      color: '#ff6b6b'
    },
    {
      title: 'iLearnX Automation (SQA Internship)',
      description: 'Internship work as SQA Automation Engineer at iLearnX Tech. Contributed to building comprehensive test automation framework using Playwright and Java. Integrated multiple tools including Jira, VS Code, Excel management, and other automation applications for quality assurance.',
      tech: ['Playwright', 'Java', 'Jira', 'Excel Automation', 'VS Code', 'Test Automation'],
      github: 'https://github.com/Showrav88/ilearnx_Automation_Playwright-java-',
      images: [
        '/images/documents/ilearnx-test-cases.png'],
      color: '#4ecdc4'
    },
    {
      title: 'Bikroy.com Testing Project',
      description: 'Comprehensive SQA testing project for "Bikroy.com" website using Selenium IDE. Test cases created for detailed testing of specific functionalities, ensuring quality assurance across all platform features with systematic test coverage.',
      tech: ['Selenium IDE', 'Test Cases', 'QA Testing', 'Web Testing', 'Bikroy.com'],
      github: 'https://github.com/Showrav88/Software-Quality-Assurance-and-Testing-Project',
      images: [
        '/images/documents/bikroy-test-cases.png',
        '/images/documents/bikroy-selenium-ide.png',
        '/images/documents/bikroy-test-results.png'
      ],
      color: '#95e1d3'
    }
  ];

  return (
    <>
      <section id="projects" className="min-h-screen pt-32 pb-20 px-6 bg-gradient-to-b from-[#001219] to-[#005f73]">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-12 bg-gradient-to-r from-[#94d2bd] to-[#ee9b00] bg-clip-text text-transparent"
          >
            Projects
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-12">
            {projects.map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="w-full"
              >
                <div 
                  className="bg-[#001219]/80 backdrop-blur-lg rounded-2xl overflow-hidden border-2 transition-all duration-300 hover:-translate-y-2 h-full flex flex-col" 
                  style={{ borderColor: project.color, boxShadow: `0 4px 20px ${project.color}20` }}
                >
                  {/* Project Image/Carousel */}
                  <div className="relative h-56 overflow-hidden group flex-shrink-0">
                    <img
                      src={project.images[currentImageIndex[index] || 0]}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                      onClick={() => setSelectedImage(project.images[currentImageIndex[index] || 0])}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#001219] via-transparent to-transparent opacity-60" />
                    
                    {/* Image Navigation Dots (only if multiple images) */}
                    {project.images.length > 1 && (
                      <>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                          {project.images.map((_, imgIndex) => (
                            <button
                              key={imgIndex}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentImageIndex(prev => ({ ...prev, [index]: imgIndex }));
                              }}
                              className={`w-2 h-2 rounded-full transition-all ${
                                (currentImageIndex[index] || 0) === imgIndex 
                                  ? 'w-6' 
                                  : 'bg-white/50 hover:bg-white/80'
                              }`}
                              style={{
                                backgroundColor: (currentImageIndex[index] || 0) === imgIndex ? project.color : undefined
                              }}
                            />
                          ))}
                        </div>

                        {/* Arrow Navigation */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(prev => ({
                              ...prev,
                              [index]: ((prev[index] || 0) - 1 + project.images.length) % project.images.length
                            }));
                          }}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          ←
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCurrentImageIndex(prev => ({
                              ...prev,
                              [index]: ((prev[index] || 0) + 1) % project.images.length
                            }));
                          }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                          →
                        </button>
                      </>
                    )}

                    <div 
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30 cursor-pointer"
                      onClick={() => setSelectedImage(project.images[currentImageIndex[index] || 0])}
                    >
                      <ExternalLink size={32} className="text-white" />
                    </div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-[#e9d8a6] mb-3">{project.title}</h3>
                    <p className="text-[#94d2bd] mb-4 leading-relaxed flex-1">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map((tech, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="px-3 py-1 rounded-full text-sm border backdrop-blur-sm"
                          style={{ borderColor: project.color, color: project.color, backgroundColor: `${project.color}10` }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>

                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all hover:scale-105 mt-auto self-start"
                      style={{ backgroundColor: project.color, color: '#001219' }}
                    >
                      <Github size={18} /> View on GitHub
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
          onClick={() => setSelectedImage(null)}
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            className="relative max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white text-4xl hover:text-[#ee9b00] transition-colors"
            >
              ×
            </button>
            <img
              src={selectedImage}
              alt="Project preview"
              className="w-full h-auto rounded-lg shadow-2xl"
            />
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Projects;