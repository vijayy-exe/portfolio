"use client";

import { Skeleton } from "@/components/ui/skeleton"
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { useInView } from 'react-intersection-observer';

const ITEMS_PER_PAGE = 10;

interface Photo {
  id: string;
  alt_description: string | null;
  urls: {
    small: string;
    thumb: string;
    full: string;
  };
  links: {
    html: string;
  };
}

interface SectionProps {
  children: React.ReactNode;
  id: string;
}

const Section: React.FC<SectionProps> = ({ children, id }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
  });

  return (
    <motion.section
      id={id}
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.5 }}
      className="mb-20"
    >
      {children}
    </motion.section>
  );
};

const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const fetchPhotos = async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await axios.get(`https://api.unsplash.com/users/vijay_exe/photos`, {
        params: {
          page: page,
          per_page: ITEMS_PER_PAGE,
          order_by: 'views',
        },
        headers: {
          Authorization: `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
        },
      });
      setPhotos(res.data);
      setTotalPages(parseInt(res.headers['x-total-pages'] || 2));
    } catch (error) {
      console.error("Error fetching photos:", error);
      setError("Failed to fetch photos. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos(currentPage);
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }

    // Starry background setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 1000;
    const positionArray = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount * 3; i++) {
      positionArray[i] = (Math.random() - 0.5) * 2000;
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    const starsMaterial = new THREE.PointsMaterial({ color: 0xffffff });
    const stars = new THREE.Points(starsGeometry, starsMaterial);

    scene.add(stars);
    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      stars.rotation.y += 0.001;
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen text-white font-sans overflow-x-hidden">
        <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />
        <main className="relative z-10">
          <div className="max-w-screen-xl mx-auto p-6">
            <Section id="gallery-intro">
              <Skeleton className="h-16 w-48 bg-gray-700/50" />
            </Section>

            <Section id="photo-grid">
              <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
                {Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
                  <div key={index} className="break-inside-avoid mb-4">
                    <Skeleton className="w-full h-64 rounded-lg bg-gray-700/50" />
                  </div>
                ))}
              </div>
            </Section>

            <Section id="pagination">
              <div className="mt-8 flex flex-col justify-center gap-4 items-center">
                <div className="flex gap-2 justify-center">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Skeleton key={index} className="w-10 h-10 rounded-lg bg-gray-700/50" />
                  ))}
                </div>
                <div className="flex justify-between gap-2 w-full max-w-xs">
                  <Skeleton className="w-full h-10 rounded-lg bg-gray-700/50" />
                  <Skeleton className="w-full h-10 rounded-lg bg-gray-700/50" />
                </div>
              </div>
            </Section>
          </div>
        </main>
      </div>
    );
  }
  if (error) {
    return (
      <div className="relative min-h-screen  text-white font-sans overflow-x-hidden">
        <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />
        <div className="text-center text-red-500 relative z-10">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen  text-white font-sans overflow-x-hidden">
      <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0" />
      <main className="relative z-10">
        <div className="max-w-screen-xl mx-auto p-6" ref={scrollRef}>
          <Section id="gallery-intro">
            <motion.h1 
              className="text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Gallery
            </motion.h1>
          </Section>

          <Section id="photo-grid">
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
              {photos.length > 0 ? (
                photos.map((photo) => (
                  <motion.div 
                    key={photo.id} 
                    className="break-inside-avoid mb-4 rounded-lg overflow-hidden shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    <a href={photo.links.html} target="_blank" rel="noopener noreferrer">
                      <img
                        src={photo.urls.full}
                        alt={photo.alt_description || 'Photo'}
                        width={300}
                        height={200}
                        className="object-cover w-full"
                      />
                    </a>
                  </motion.div>
                ))
              ) : (
                <p className="text-center">No images found.</p>
              )}
            </div>
          </Section>

          {/* Pagination */}
          <Section id="pagination">
            <div className="mt-8 flex flex-col justify-center gap-4 items-center">
              {/* Display the current set of page numbers */}
              <div className="flex gap-2 justify-center">
                {/* Always show the first page */}
                <motion.button
                  key={1}
                  onClick={() => handlePageChange(1)}
                  className="px-4 py-1 bg-opacity-10 backdrop-blur-md rounded-lg hover:bg-opacity-30 transition-all duration-300"
                  style={{
                    background: currentPage === 1
                      ? 'rgba(128, 0, 128, 0.3)'
                      : 'rgba(173, 216, 230, 0.2)',
                    boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: currentPage === 1
                      ? 'rgba(255, 255, 255, 1)'
                      : 'rgba(255, 255, 255, 0.8)',
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  1
                </motion.button>

                {/* Ellipses if there are more pages between */}
                {currentPage > 4 && <span className="text-white">...</span>}

                {/* Pages around the current page */}
                {Array.from({ length: 5 }, (_, index) => {
                  const actualPage = currentPage - 2 + index;
                  if (actualPage > 1 && actualPage < totalPages) {
                    return (
                      <motion.button
                        key={actualPage}
                        onClick={() => handlePageChange(actualPage)}
                        className="px-4 py-1 bg-opacity-10 backdrop-blur-md rounded-lg hover:bg-opacity-30 transition-all duration-300"
                        style={{
                          background: currentPage === actualPage
                            ? 'rgba(128, 0, 128, 0.3)'
                            : 'rgba(173, 216, 230, 0.2)',
                          boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
                          border: '1px solid rgba(255, 255, 255, 0.25)',
                          color: currentPage === actualPage
                            ? 'rgba(255, 255, 255, 1)'
                            : 'rgba(255, 255, 255, 0.8)',
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {actualPage}
                      </motion.button>
                    );
                  }
                  return null;
                })}

                {/* Ellipses if there are more pages towards the end */}
                {currentPage < totalPages - 3 && <span className="text-white">...</span>}

                {/* Always show the last page */}
                {totalPages > 1 && (
                  <motion.button
                    key={totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    className="px-4 py-1 bg-opacity-10 backdrop-blur-md rounded-lg hover:bg-opacity-30 transition-all duration-300"
                    style={{
                      background: currentPage === totalPages
                        ? 'rgba(128, 0, 128, 0.3)'
                        : 'rgba(173, 216, 230, 0.2)',
                      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
                      border: '1px solid rgba(255, 255, 255, 0.25)',
                      color: currentPage === totalPages
                        ? 'rgba(255, 255, 255, 1)'
                        : 'rgba(255, 255, 255, 0.8)',
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {totalPages}
                  </motion.button>
                )}
              </div>

              {/* "Previous" and "Next" buttons below */}
              <div className="flex justify-between gap-2 w-full max-w-xs">
                {currentPage > 1 && (
                  <motion.button
                    onClick={handlePrevPage}
                    className="w-full px-6 py-2 bg-opacity-10 backdrop-blur-md rounded-lg hover:bg-opacity-20 transition-all duration-300"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
                      border: '1px solid rgba(255, 255, 255, 0.18)',
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Previous
                  </motion.button>
                )}

                {currentPage < totalPages && (
                  <motion.button
                    onClick={handleNextPage}
                    className="w-full px-6 py-2 bg-opacity-10 backdrop-blur-md rounded-lg hover:bg-opacity-20 transition-all duration-300"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37)',
                      border: '1px solid rgba(255, 255, 255, 0.18)',
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Next
                  </motion.button>
                )}
              </div>
            </div>
          </Section>

          <style jsx>{`
            @media (max-width: 640px) {
              button {
                font-size: 14px;
                padding: 10px 16px;
              }
            }
          `}</style>
        </div>
      </main>
    </div>
  );
};

export default Gallery;