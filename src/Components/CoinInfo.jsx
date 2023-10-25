import axios from "axios";
import { useEffect, useState } from "react";
import { HistoricalChart } from "../config/api";
import { CryptoState } from "../Context/CryptoContext";
import {
  CircularProgress,
  ThemeProvider,
  createTheme,
  makeStyles,
} from "@material-ui/core";
import {
  Chart as ChartJs,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { chartDays } from "../config/data";
import SelectButton from "./SelectButton";

ChartJs.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
);

const useStyle = makeStyles((theme) => ({
  container: {
    width: "75%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 25,
    padding: 40,
    [theme.breakpoints.down("md")]: {
      width: "100%",
      marginTop: 0,
      padding: 20,
      paddingTop: 0,
    },
  },
}));

// eslint-disable-next-line react/prop-types
const CoinInfo = ({ coin }) => {
  const [historicData, setHistoricData] = useState();
  const [days, setDays] = useState(1);
  const { currency } = CryptoState();

  const fetchHistoricalData = async () => {
    // eslint-disable-next-line react/prop-types
    const { data } = await axios.get(HistoricalChart(coin.id, days, currency));
    setHistoricData(data.prices);
    // console.log(data)
  };

  // console.log(historicData)

  useEffect(() => {
    fetchHistoricalData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency, days]);

  const darkTheme = createTheme({
    palette: {
      primary: {
        main: "#fff",
      },
      type: "dark",
    },
  });

  const classes = useStyle();

  return (
    <ThemeProvider theme={darkTheme}>
      <div className={classes.container}>
        {!historicData ? (
          <CircularProgress
            style={{ color: "gold" }}
            size={250}
            thickness={1}
          />
        ) : (
          <>
            <Line
              data={{
                labels: historicData.map((coin) => {
                  let date = new Date(coin[0]);
                  let time =
                    date.getHours() > 12
                      ? `${date.getHours() - 12}:${date.getMinutes()} PM`
                      : `${date.getHours()}:${date.getMinutes()} AM`;

                  return days === 1 ? time : date.toLocaleDateString();
                }),
                datasets: [
                  {
                    data: historicData.map((coin) => coin[1]),
                    label: `Price ( Past ${days} Days ) in ${currency}`,
                    borderColor: "gold",
                  },
                ],
              }}
              options={{
                elements: {
                  point: {
                    radius: 1,
                  },
                },
                plugins: {
                  legend: true,
                },
              }}
            ></Line>
            <div
              style={{
                display: "flex",
                justifyContent: "space-around",
                width: "100%",
                marginTop: 20,
              }}
            >
              {chartDays.map((day) => (
                <SelectButton
                  key={day.value}
                  onClick={() => setDays(day.value)}
                  selected={day.value === days}
                >
                  {day.label}
                </SelectButton>
              ))}
            </div>
          </>
        )}
      </div>
    </ThemeProvider>
  );
};

export default CoinInfo;
