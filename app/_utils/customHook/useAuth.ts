"use client";

import React, { ReactNode, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDispatch } from "react-redux";
import { addToken } from "../../_redux/features/auth";

interface Props {
  children: ReactNode;
}

export const useAuth = () => {
  const dispatch = useDispatch();
  const { data } = useSession();
  dispatch(addToken(data));
  useEffect(() => {
    if (data) {
      dispatch(addToken(data.user));
    }
  }, [data, dispatch]);
};
