'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { Camera, Upload, Search, X, Loader2 } from 'lucide-react';
import { useLanguage } from "../context/LanguageContext";
import { apiService, FoodPrediction, Restaurant } from "../../services/api";
import RestaurantMap from "./RestaurantMap";

const FoodScanner = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [predictions, setPredictions] = useState<FoodPrediction[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | undefined>();
  const { t } = useLanguage();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
        setUploadedFile(file);
        setPredictions([]);
        setRestaurants([]);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFoodRecognition = async () => {
    if (!uploadedFile) return;

    setIsLoading(true);
    setError(null);

    try {
      const recognitionResult = await apiService.recognizeFood(uploadedFile);
      setPredictions(recognitionResult.predictions);

      // Automatically search for restaurants based on top prediction
      if (recognitionResult.top_prediction) {
        await handleRestaurantSearch(recognitionResult.top_prediction.food_name); // Changed to food_name
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('Recognition failed'));
      console.error('Food recognition error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestaurantSearch = async (dishName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Get user's location if available
      let location: { lat: number; lon: number } | undefined;

      if (navigator.geolocation) {
        location = await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const userLoc = {
                lat: position.coords.latitude,
                lon: position.coords.longitude,
              };
              setUserLocation(userLoc);
              resolve(userLoc);
            },
            () => resolve(undefined)
          );
        });
      }

      const restaurantResult = await apiService.searchRestaurants(dishName, location);
      setRestaurants(restaurantResult.restaurants);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('Restaurant search failed'));
      console.error('Restaurant search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetake = () => {
    setSelectedImage(null);
    setUploadedFile(null);
    setPredictions([]);
    setRestaurants([]);
    setError(null);
  };

  return (
    <section id="scanner" ref={ref} className="py-20 bg-black font-Montserrat">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('Scan Your')} <span className="text-orangeCustom">{t('Food')}</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {t("Take a picture or upload an image of any food, and we'll find restaurants near you that serve it.")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Scanner Section */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 shadow-2xl">
              {!selectedImage ? (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="border-2 border-dashed border-white/30 rounded-2xl p-12 text-center cursor-pointer group relative overflow-hidden" // Added relative and overflow-hidden
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Camera className="w-16 h-16 text-orangeCustom mx-auto mb-4 group-hover:text-orange-400 transition-colors" />
                  </motion.div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {t('Upload Food Image')}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    {t('Click to upload or drag and drop')}
                  </p>
                  <p className="text-sm text-gray-400">
                    {t('PNG, JPG, JPEG up to 10MB')}
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {/* Animated scanning effect - constrained to container */}
                  <motion.div
                    animate={{
                      y: [0, '2000%', 0], // Use percentage to stay within container
                      opacity: [0, 0.6, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="absolute left-4 right-4 bg-gradient-to-b from-orangeCustom/80 to-orangeCustom/20 rounded-full blur-sm"
                    style={{
                      height: '5%', // Considerable height coverage
                      top: '0%'
                    }}
                  />
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center relative"
                >
                  <div className="relative overflow-hidden rounded-2xl"> {/* Added overflow-hidden */}
                    <img
                      src={selectedImage}
                      alt="Uploaded food"
                      className="w-full h-64 object-cover rounded-2xl mb-4 border-2 border-orangeCustom/50"
                    />

                    <motion.div
                      animate={{
                        y: [0, '1800%', 0], // Use percentage to stay within container
                        opacity: [0, 0.8, 0]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                      className="absolute left-4 right-4 bg-gradient-to-b from-orangeCustom/80 to-orangeCustom/20 rounded-full blur-sm"
                      style={{
                        height: '5%', // Considerable height coverage
                        top: '0%'
                      }}
                    />
                  </div>

                  {/* Predictions Display */}
                  {predictions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10"
                    >
                      <h4 className="text-white font-semibold mb-3">{t('AI Detection Results')}:</h4>
                      <div className="space-y-2">
                        {predictions.map((pred, index) => (
                          <div key={index} className="flex justify-between items-center text-sm">
                            <span className="text-gray-300 capitalize">{t(pred.food_name)}</span> {/* Changed to food_name */}
                            <span className="text-orangeCustom font-semibold">
                              {(pred.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Error Display */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm"
                    >
                      {error}
                    </motion.div>
                  )}

                  <div className="flex gap-4 justify-center">
                    {!predictions.length ? (
                      <motion.button
                        onClick={handleFoodRecognition}
                        disabled={isLoading}
                        whileHover={{ scale: isLoading ? 1 : 1.05 }}
                        whileTap={{ scale: isLoading ? 1 : 0.95 }}
                        className="bg-orangeCustom text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orangeCustom/25 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {t('Analyzing...')}
                          </>
                        ) : (
                          <>
                            <Search size={20} />
                            {t('Analyze Food')}
                          </>
                        )}
                      </motion.button>
                    ) : (
                      <motion.button
                        onClick={() => predictions[0] && handleRestaurantSearch(predictions[0].food_name)}
                        disabled={isLoading}
                        whileHover={{ scale: isLoading ? 1 : 1.05 }}
                        whileTap={{ scale: isLoading ? 1 : 0.95 }}
                        className="bg-orangeCustom text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-orange-600 transition-colors shadow-lg shadow-orangeCustom/25 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {t('Searching...')}
                          </>
                        ) : (
                          <>
                            <Search size={20} />
                            {t('Find Restaurants')}
                          </>
                        )}
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleRetake}
                      disabled={isLoading}
                      className="flex items-center justify-center gap-2 border border-white/30 text-white px-6 py-3 rounded-full font-medium hover:border-orangeCustom hover:text-orangeCustom transition-colors disabled:opacity-50"
                    >
                      <X size={20} />
                      {t('Retake')}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Restaurant Results with Map */}
            {restaurants.length > 0 && (
              <div className="space-y-6">
                {/* Map Section */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {t('Restaurants Serving')} {predictions[0]?.food_name && t(predictions[0].food_name)}
                  </h3>

                  {/* Embedded Yandex Map */}
                  <RestaurantMap
                    restaurants={restaurants}
                    userLocation={userLocation}
                    height="300px"
                  />
                </motion.div>

                {/* Restaurant List */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                >
                  <h4 className="text-lg font-semibold text-white mb-4">
                    {t('Restaurant List')} ({restaurants.length})
                  </h4>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {restaurants.map((restaurant) => (
                      <motion.div
                        key={restaurant.id}
                        whileHover={{ scale: 1.02 }}
                        className="p-4 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-white font-semibold">{restaurant.name}</h4>
                          </div>
                          <div className="text-right">
                            <span className="text-orangeCustom font-semibold block">{restaurant.rating} ★</span>
                            <span className="text-gray-400 text-sm">{restaurant.price_range}</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-400">{restaurant.distance}</span>
                          <button
                            onClick={() => {
                              // Open directions in Yandex Maps
                              const url = `https://yandex.com/maps/?pt=${restaurant.coordinates.lon},${restaurant.coordinates.lat}&z=15&l=map`;
                              window.open(url, '_blank');
                            }}
                            className="text-orangeCustom hover:text-orange-400 transition-colors"
                          >
                            {t('Get Directions')} →
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>

          {/* How It Works Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold text-white mb-6">
              {t('How It')} <span className="text-orangeCustom">{t('Works')}</span>
            </h3>

            {[
              {
                step: '1',
                title: t('Take a Picture'),
                description: t('Snap a photo of any food you want to find'),
                icon: ''
              },
              {
                step: '2',
                title: t('AI Recognition'),
                description: t('Our AI identifies the dish and ingredients'),
                icon: ''
              },
              {
                step: '3',
                title: t('Find Restaurants'),
                description: t('Discover local places that serve similar dishes'),
                icon: ''
              },
              {
                step: '4',
                title: t('Order & Enjoy'),
                description: t('Place your order and satisfy your cravings'),
                icon: ''
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
                className="flex items-center gap-6 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:border-orangeCustom/30 transition-all duration-300 group"
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex-shrink-0 w-14 h-14 bg-orangeCustom text-white rounded-2xl flex items-center justify-center font-bold text-lg group-hover:bg-orange-600 transition-colors"
                >
                  {item.step}
                </motion.div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                   <h4 className="font-semibold text-white text-lg">
                      {item.title}
                    </h4>
                  </div>
                  <p className="text-gray-300">{item.description}</p>
                </div>

                {/* Animated line connector (except for last item) */}
                {index < 3 && (
                  <motion.div
                    animate={{
                      height: [0, 20, 0],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.5,
                      ease: "easeInOut"
                    }}
                    className="absolute -bottom-6 left-8 w-0.5 h-6 bg-orangeCustom"
                  />
                )}
              </motion.div>


            ))}
          </motion.div>
        </div>

        {/* Additional Features */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {[
            {
              title: t("Fast Processing"),
              description: t("Get results in under 5 seconds"),
              stat: "< 5s"
            },
            {
              title: t("High Accuracy"),
              description: t("95% accurate food recognition"),
              stat: "95%"
            },
            {
              title: t("Wide Coverage"),
              description: t("Thousands of restaurants worldwide"),
              stat: "10K+"
            }
          ].map((feature, index) => (
            <motion.div
              key={feature.title}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 text-center"
            >
              <div className="text-3xl font-bold text-orangeCustom mb-2">{feature.stat}</div>
              <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
              <p className="text-gray-300">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FoodScanner;