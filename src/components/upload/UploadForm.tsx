                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-200"
                            onClick={() => removeFile(index)}
                          >
                            <FiX />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <button
                      className="mt-4 w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                      onClick={handleFileUpload}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <span className="mr-2">Đang tải lên... {uploadProgress}%</span>
                          <div className="w-24 h-1.5 bg-white bg-opacity-30 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-white rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </>
                      ) : uploadSuccess ? (
                        <>
                          <FiCheck className="mr-2" /> Tải lên thành công!
                        </>
                      ) : (
                        <>
                          <FiUpload className="mr-2" /> Tải lên
                        </>
                      )}
                    </button>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="link-upload"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-4">
                  <div>
                    <label htmlFor="drive-link" className="block text-sm font-medium text-gray-700 mb-1">
                      Link Google Drive
                    </label>
                    <input
                      type="text"
                      id="drive-link"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="https://drive.google.com/file/d/..."
                      value={driveLink}
                      onChange={(e) => setDriveLink(e.target.value)}
                      disabled={isUploading}
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Nhập link chia sẻ từ Google Drive (đảm bảo link đã được chia sẻ công khai)
                    </p>
                  </div>
                  
                  <button
                    className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                    onClick={handleDriveLinkSubmit}
                    disabled={!driveLink.trim() || isUploading}
                  >
                    {isUploading ? (
                      <>
                        <span className="mr-2">Đang xử lý... {uploadProgress}%</span>
                        <div className="w-24 h-1.5 bg-white bg-opacity-30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-white rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </>
                    ) : uploadSuccess ? (
                      <>
                        <FiCheck className="mr-2" /> Xử lý thành công!
                      </>
                    ) : (
                      <>
                        <FiLink className="mr-2" /> Xử lý link
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Upload guidelines */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Lưu ý khi tải ảnh lên</h3>
        <ul className="text-blue-700 space-y-1 list-disc pl-5">