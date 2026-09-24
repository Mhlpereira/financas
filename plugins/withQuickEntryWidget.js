const { AndroidConfig, withAndroidManifest, withDangerousMod } = require('expo/config-plugins');
const fs = require('fs');
const path = require('path');

const WIDGET_CLASS = 'QuickEntryWidget';

const widgetKotlin = (packageName, scheme) => `package ${packageName}

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.widget.RemoteViews

class ${WIDGET_CLASS} : AppWidgetProvider() {
    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        appWidgetIds.forEach { widgetId ->
            val views = RemoteViews(context.packageName, R.layout.quick_entry_widget)
            views.setOnClickPendingIntent(R.id.widget_expense, deepLink(context, "expense", 1))
            views.setOnClickPendingIntent(R.id.widget_income, deepLink(context, "income", 2))
            views.setOnClickPendingIntent(R.id.widget_invest, deepLink(context, "invest", 3))
            appWidgetManager.updateAppWidget(widgetId, views)
        }
    }

    private fun deepLink(context: Context, kind: String, requestCode: Int): PendingIntent {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("${scheme}://quick?kind=" + kind)).apply {
            setPackage(context.packageName)
            addFlags(Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP)
        }
        return PendingIntent.getActivity(
            context,
            requestCode,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
    }
}
`;

const widgetLayout = `<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="12dp"
    android:background="@drawable/quick_entry_widget_background">

    <TextView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Meu Caixa"
        android:textColor="#8A9AAD"
        android:textSize="11sp"
        android:letterSpacing="0.06"
        android:layout_marginBottom="8dp" />

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1"
        android:orientation="horizontal">

        <TextView
            android:id="@+id/widget_expense"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:layout_marginEnd="6dp"
            android:gravity="center"
            android:text="− Gasto"
            android:textColor="#F87171"
            android:textSize="15sp"
            android:textStyle="bold"
            android:background="@drawable/quick_entry_button_expense" />

        <TextView
            android:id="@+id/widget_income"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:layout_marginEnd="6dp"
            android:gravity="center"
            android:text="+ Entrada"
            android:textColor="#34D399"
            android:textSize="15sp"
            android:textStyle="bold"
            android:background="@drawable/quick_entry_button_income" />

        <TextView
            android:id="@+id/widget_invest"
            android:layout_width="0dp"
            android:layout_height="match_parent"
            android:layout_weight="1"
            android:gravity="center"
            android:text="Investir"
            android:textColor="#C7D2FE"
            android:textSize="15sp"
            android:textStyle="bold"
            android:background="@drawable/quick_entry_button_invest" />
    </LinearLayout>
</LinearLayout>
`;

const widgetInfo = `<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="250dp"
    android:minHeight="70dp"
    android:targetCellWidth="5"
    android:targetCellHeight="1"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen"
    android:initialLayout="@layout/quick_entry_widget"
    android:previewLayout="@layout/quick_entry_widget"
    android:description="@string/quick_entry_widget_description"
    android:updatePeriodMillis="0" />
`;

const shape = (fill, stroke) => `<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">
    <solid android:color="${fill}" />
    <stroke android:width="1dp" android:color="${stroke}" />
    <corners android:radius="16dp" />
</shape>
`;

function writeFile(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, 'utf8');
}

const withWidgetFiles = (config) =>
  withDangerousMod(config, [
    'android',
    async (mod) => {
      const projectRoot = mod.modRequest.platformProjectRoot;
      const packageName = AndroidConfig.Package.getPackage(mod);
      const scheme = Array.isArray(mod.scheme) ? mod.scheme[0] : mod.scheme;

      if (!packageName) throw new Error('withQuickEntryWidget: android.package não definido');
      if (!scheme) throw new Error('withQuickEntryWidget: scheme não definido');

      const main = path.join(projectRoot, 'app/src/main');
      const javaDir = path.join(main, 'java', ...packageName.split('.'));

      writeFile(path.join(javaDir, `${WIDGET_CLASS}.kt`), widgetKotlin(packageName, scheme));
      writeFile(path.join(main, 'res/layout/quick_entry_widget.xml'), widgetLayout);
      writeFile(path.join(main, 'res/xml/quick_entry_widget_info.xml'), widgetInfo);
      writeFile(
        path.join(main, 'res/drawable/quick_entry_widget_background.xml'),
        shape('#151B23', '#253040'),
      );
      writeFile(
        path.join(main, 'res/drawable/quick_entry_button_expense.xml'),
        shape('#F8717122', '#F8717144'),
      );
      writeFile(
        path.join(main, 'res/drawable/quick_entry_button_income.xml'),
        shape('#34D39922', '#34D39944'),
      );
      writeFile(
        path.join(main, 'res/drawable/quick_entry_button_invest.xml'),
        shape('#6366F122', '#6366F144'),
      );

      const stringsPath = path.join(main, 'res/values/strings.xml');
      const strings = fs.readFileSync(stringsPath, 'utf8');
      if (!strings.includes('quick_entry_widget_description')) {
        writeFile(
          stringsPath,
          strings.replace(
            '</resources>',
            '  <string name="quick_entry_widget_description">Lançar um gasto ou entrada em dois toques</string>\n</resources>',
          ),
        );
      }

      return mod;
    },
  ]);

const withWidgetReceiver = (config) =>
  withAndroidManifest(config, (mod) => {
    const application = AndroidConfig.Manifest.getMainApplicationOrThrow(mod.modResults);

    application.receiver = (application.receiver ?? []).filter(
      (item) => item.$?.['android:name'] !== `.${WIDGET_CLASS}`,
    );

    application.receiver.push({
      $: {
        'android:name': `.${WIDGET_CLASS}`,
        'android:exported': 'false',
      },
      'intent-filter': [
        { action: [{ $: { 'android:name': 'android.appwidget.action.APPWIDGET_UPDATE' } }] },
      ],
      'meta-data': [
        {
          $: {
            'android:name': 'android.appwidget.provider',
            'android:resource': '@xml/quick_entry_widget_info',
          },
        },
      ],
    });

    return mod;
  });

module.exports = (config) => withWidgetReceiver(withWidgetFiles(config));
