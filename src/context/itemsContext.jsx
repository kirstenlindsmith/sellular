import { createContext, useCallback, useEffect, useState } from 'react';
import { backendRoutes, frontendRoutes, storageKeys } from '../constants';
import { getItem, navigate, removeItem, setItem } from '../helpers';
