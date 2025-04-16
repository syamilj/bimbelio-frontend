import axiosInstance from "./axios/axiosInstance";
import { response, responseError } from "./response";

export const getGeneral = async (
  url: string,
  more?: {
    setData?: React.Dispatch<React.SetStateAction<any>>;
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
    firstLoad?: boolean;
    endLoad?: boolean;
    onSuccess?: ({
      message,
      status,
      data,
    }: {
      message: string;
      status: number;
      data?: any;
    }) => any;
    onError?: ({
      status,
      message,
      error,
    }: {
      status: number;
      message: string;
      error: any;
    }) => any;
  }
) => {
  try {
    if (
      more?.setLoading &&
      (more?.firstLoad == true || !more || more.firstLoad === undefined)
    ) {
      more.setLoading(true);
    }
    const res = await axiosInstance.get(url);
    const resData = response(res);
    if (more?.onSuccess) {
      await more.onSuccess(resData);
    }
    if (more?.setData) more.setData(resData.data);
    return resData.data;
  } catch (error) {
    const errData = responseError(error, true);
    if (more?.onError) {
      await more.onError({
        status: errData.status,
        message: errData.message,
        error: errData.error,
      });
    }
  } finally {
    if (
      more?.setLoading &&
      (more?.endLoad == true || !more || more.endLoad === undefined)
    ) {
      more.setLoading(false);
    }
  }
};

export const mutateGeneral = async (
  url: string,
  more: {
    payload: any;
    type: "post" | "put";
    setLoading?: React.Dispatch<React.SetStateAction<boolean>>;
    firstLoad?: boolean;
    endLoad?: boolean;
    toast?: {
      hide?: boolean;
      successTitle?: string;
      successMsg?: string;
      errorTitle?: string;
      errorMsg?: string;
    };
    onSuccess?: ({
      message,
      status,
      data,
    }: {
      message: string;
      status: number;
      data?: any;
    }) => any;
    onError?: ({
      status,
      message,
      error,
    }: {
      status: number;
      message: string;
      error: any;
    }) => any;
  }
) => {
  const { payload, type, setLoading } = more;
  if (
    setLoading &&
    (more?.firstLoad == true || !more || more.firstLoad === undefined)
  ) {
    setLoading(true);
  }

  let showToast = true;
  if (more.toast && more.toast.hide) showToast = false;

  try {
    const res = await axiosInstance[type](url, payload);
    const resData = response(
      res,
      showToast,
      more.toast?.successMsg,
      more.toast?.successTitle
    );
    if (more?.onSuccess) {
      await more.onSuccess(resData);
    }
    return;
  } catch (error) {
    const errData = responseError(
      error,
      showToast,
      more.toast?.errorMsg,
      more.toast?.errorTitle
    );
    if (more?.onError) {
      await more.onError({
        status: errData.status,
        message: errData.message,
        error: errData.error,
      });
    }
    return;
  } finally {
    if (
      setLoading &&
      (more?.endLoad == true || !more || more.endLoad === undefined)
    ) {
      setLoading(false);
    }
  }
};

// Example

/*

const [Data, setData] = useState<any>();
const [isLoading, setIsLoading] = useState<boolean>(true);

mutateGeneral("url", {
    payload: ,
    type: "",
    setLoading: ,
    onSuccess: refresh,
    onError({ message }) {
        setError(message);
    },
});

getGeneral("url", {
    setData: ,
    setLoading: ,
});

*/
