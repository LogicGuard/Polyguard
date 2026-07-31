cmake_minimum_required(VERSION 3.14)
project(PolyGuardKZG CXX)

set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

add_library(polyguard_kzg SHARED
    src/kzg_verifier.cpp
)

target_include_directories(polyguard_kzg PUBLIC ${CMAKE_CURRENT_SOURCE_DIR}/include)
