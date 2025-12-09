/*
SPDX-FileCopyrightText: Copyright (c) 2024 NVIDIA CORPORATION & AFFILIATES. All rights reserved.
SPDX-License-Identifier: MIT
*/

import React, { useState } from 'react';
import { powerBIFilterService } from '../service/PowerBIFilterService';
import './FilterButtonPanel.css';

const FilterButtonPanel: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const regions = ['Asia Pacific', 'Europe', 'North & Center America', 'South America'];

  const handleFilterClick = async (region: string) => {
    setLoading(true);
    setMessage('');
    setSelectedRegion(region);
    
    try {
      await powerBIFilterService.applyRegionFilter(region);
      setMessage(`✅ Filtered by Region: ${region}`);
    } catch (error) {
      setMessage(`❌ Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleClearFilters = async () => {
    setLoading(true);
    setMessage('');
    setSelectedRegion(null);
    
    try {
      await powerBIFilterService.clearFilters();
      setMessage('✅ All filters cleared');
    } catch (error) {
      setMessage(`❌ Error: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="filter-button-panel">
      <div className="filter-header">
        <h4>📊 Region Filter</h4>
      </div>
      
      <div className="filter-buttons">
        {regions.map((region) => (
          <button
            key={region}
            onClick={() => handleFilterClick(region)}
            disabled={loading}
            className={`filter-btn ${selectedRegion === region ? 'active' : ''}`}
          >
            {region}
          </button>
        ))}
        
        <button
          onClick={handleClearFilters}
          disabled={loading}
          className="filter-btn clear-btn"
        >
          Clear
        </button>
      </div>

      {message && (
        <div className={`filter-message ${message.includes('❌') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default FilterButtonPanel;
