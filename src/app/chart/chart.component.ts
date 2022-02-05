import { Component, OnInit } from '@angular/core';
import { ChartService } from '../chart.service';

import { io } from 'socket.io-client';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Chart } from 'chart.js';
import * as moment from 'moment';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  socket;
  tempList = [];
  timeList = [];
  barChart: any;
  lineChart: any;
  datas: any = [];
  user: any;

  constructor(
    private chartService: ChartService,
    private authService: AuthService,
    private router: Router,
    public snackBar: MatSnackBar
  ) {
    this.socket = io();
  }

  ngOnInit() {
    this.authService.authInfo.subscribe((data) => {
      this.user = data.userInformation;
      console.log(this.user, 'auth info');
    });
    this.getTemps();
    this.socket.on('newTempAdded', () => {
      this.getTemps();
    });

    this.barChart = new Chart('bar', {
      type: 'bar',
      options: {
        responsive: true,
        title: {
          display: false,
          text: `Bar Chart ${new Date()}`,
        },
      },
      data: {
        labels: [],
        datasets: [
          {
            type: 'bar',
            label: 'Temperature',
            data: [],
            backgroundColor: 'rgba(0,0,255,0.4)',
            borderColor: 'rgba(255,0,255,0.4)',
            fill: true,
          },
        ],
      },
    });
    this.lineChart = new Chart('line', {
      type: 'line',
      options: {
        responsive: true,
        title: {
          display: false,
          text: `Graph Chart ${new Date()}`,
        },
      },
      data: {
        labels: [],
        datasets: [
          {
            type: 'line',
            label: 'Temperature',
            backgroundColor: 'rgba(255,0,255,0.4)',
            borderColor: 'rgba(0,0,255,0.4)',
            data: [],
            fill: true,
          },
        ],
      },
    });
  }

  getTemps() {
    this.chartService.getTempList().subscribe((datas) => {
      // this.tempList = datas.map((item) => item.temp);
      this.datas = datas;
      this.timeList = [];
      this.tempList = [];
      datas.map((item) => {
        this.timeList.push(moment(item.date).format('hh:mm A'));
        this.tempList.push(item.temp);
      });
      this.updateChartData();
    });
  }

  updateChartData() {
    this.barChart.data.datasets[0].data = this.tempList;
    this.lineChart.data.datasets[0].data = this.tempList;

    this.barChart.data.labels = this.timeList;
    this.lineChart.data.labels = this.timeList;
    // this.barChart.update();
    this.lineChart.update();
  }

  generatePDF() {
    this.snackBar.open('Downloading! Please wait!!', 'x', {
      panelClass: ['success-snackbar'],
      verticalPosition: 'top',
      duration: 3000,
    });
    html2canvas(document.getElementById('print-section'), {
      allowTaint: true,
      useCORS: false,
      scale: 1,
    }).then(function (canvas) {
      const img = canvas.toDataURL('image/png');
      const doc = new jsPDF('l', 'mm', 'a4');
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();
      doc.addImage(img, 'PNG', 5, 5, width - 20, height - 20);
      doc.save(`Report ${new Date().toLocaleString()}.pdf`);
    });
  }

  logOut() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
